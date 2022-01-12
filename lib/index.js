const Buffer = require('../exports/Buffer');
const CryptoJS = require('../exports/CryptoJS');
const esptool = require('../exports/esptool.js');

module.exports = (function() {

	const { EspLoader } = esptool;

	const Serial = function(options) {

		this.options = Object.assign({
			baudRate: 115200,
			debug: true,
			flashSize: 8 * 1024 * 1024,
			logger: console,
			productId: 0xea60,
			vendorId: 0x10c4,
		}, options || {});

		this.port = null;
		this.connected = false;
	};

	Serial.prototype.getSerialPort = function() {
		return Promise.resolve().then(() => {
			return navigator.serial.getPorts().then(ports => {
				if (ports.length > 0) {
					return ports[0];
				}
				const { productId, vendorId } = this.options;
				return navigator.serial.requestPort({
					filters: [{
						usbVendorId: vendorId,
						usbProductId: productId,
					}],
				});
			});
		});
	};

	Serial.prototype.connect = function() {
		return Promise.resolve().then(() => {
			// Disconnect if already connected.
			return (this.connected && this.disconnect() || Promise.resolve()).then(() => {
				return this.getSerialPort().then(port => {
					if (!port) {
						throw new Error('USB device not found');
					}
					this.port = port;
					const { baudRate } = this.options;
					return port.open({ baudRate }).then(() => {
						const { flashSize, debug, logger } = this.options;
						const loader = new EspLoader(port, {
							flashSize,
							debug,
							logger,
						});
						this.loader = loader;
						logger.log('connecting...');
						return loader.connect().then(() => {
							logger.log('connected');
							return loader.chipName().then(chipName => {
								this.chipName = chipName;
								logger.log(`chip: "${chipName}"`);
								return loader.macAddr().then(macAddr => {
									this.macAddr = macAddr;
									logger.log(`mac address: "${macAddr}"`);
								});
							});
						});
					});
				}).then(() => {
					this.connected = true;
				}).catch(error => {
					throw new Error(`Failed to connect to Bleskomat: ${error.message}`);
				});
			});
		});
	};

	Serial.prototype.disconnect = function() {
		return Promise.resolve().then(() => {
			if (!this.connected) return;
			return (this.loader && this.loader.disconnect() || Promise.resolve()).then(() => {
				if (this.port) return this.port.close();
			}).finally(() => {
				this.connected = false;
				this.loader = null;
				this.port = null;
			});
		});
	};

	Serial.prototype.flash = function(firmware) {
		return Promise.resolve().then(() => {
			let firmwareUint8Array;
			if (typeof firmware === 'string') {
				firmwareUint8Array = new Uint8Array(Buffer.from(firmware, 'base64'));
			} else {
				firmwareUint8Array = firmware;
			}
			if (!(firmwareUint8Array instanceof Uint8Array)) {
				throw new Error('Invalid argument ("firmware"): Uint8Array or base64-encoded String expected');
			}
			return this.connect().then(() => {
				const { loader } = this;
				return loader.loadStub().then(() => {
					const { baudRate, logger } = this.options;
					return loader.setBaudRate(baudRate, 460800).then(() => {
						// See:
						// https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/partition-tables.html
						// From huge_app.csv:
						// # Name,   Type, SubType, Offset,  Size, Flags
						// nvs,	  data, nvs,	 0x9000,  0x5000,
						// otadata,  data, ota,	 0xe000,  0x2000,
						// app0,	 app,  ota_0,   0x10000, 0x300000,
						// spiffs,   data, spiffs,  0x310000,0xF0000,
						const partitions = [
							{
								name: 'app0',// String
								data: firmwareUint8Array,// Uint8Array
								offset: 0x10000,// Number
							},
						];
						logger.log('Flashing device...');
						return executePromisesInSeries(partitions.map(partition => {
							return function() {
								const { data, name, offset } = partition;
								logger.log(`Writing partition: ${name}`);
								return loader.flashData(data, offset, (blockIndex, totalBlocks) => {
									const blockNumber = blockIndex + 1;
									logger.log(`${name}: Writing block ${blockNumber} of ${totalBlocks}`);
								}).then(() => {
									return sleep(100);
								});
							};
						})).then(() => {
							logger.log('Successfully wrote device partitions');
							return this.disconnect();
						});
					});
				});
			});
		});
	};

	Serial.prototype.monitor = function(onLineCallback) {
		return Promise.resolve().then(() => {
			if (this.monitoring) return;
			return this.connect().then(() => {
				const { loader } = this;
				this.monitoring = {
					unlisten: loader.reader.listen(),
					textBuffer: '',
					interval: setInterval(() => {
						const data = loader.reader.buffer.view(true);
						if (data && data.length > 0) {
							let text = (this.textBuffer || '') + Buffer.from(data).toString('utf8');
							if (text) {
								let pos;
								while ((pos = text.indexOf('\r\n')) !== -1) {
									const line = text.substr(0, pos);
									text = text.substr(pos + '\r\n'.length);
									onLineCallback(line);
								}
								this.textBuffer = text;
							}
						}
					}, 100),
				};
			});
		});
	};

	Serial.prototype.stopMonitor = function() {
		return Promise.resolve().then(() => {
			if (!this.monitoring) return;
			clearInterval(this.monitoring.interval);
			this.monitoring.unlisten();
			this.monitoring = null;
			return this.disconnect();
		});
	};

	const ESP_SPI_FLASH_MD5 = 0x13;
	const MD5_TIMEOUT_PER_MB = 8;// timeout (per megabyte) for calculating md5sum
	Serial.prototype.calculateFlashMD5Sum = function(addr, size) {
		return Promise.resolve().then(() => {
			return this.connect().then(() => {
				const { loader } = this;
				// The MD5 command works only when stub is loaded.
				return loader.loadStub().then(() => {
					const opcode = ESP_SPI_FLASH_MD5;
					const buffer = pack('<IIII', addr, size, 0, 0);
					const checksum = 0;
					const timeout = timeoutPerMb(MD5_TIMEOUT_PER_MB, size);
					// The MD5 command returns additional bytes in the standard command reply slot.
					return loader.checkCommand(opcode, buffer, checksum, timeout).then(result => {
						result = result.splice(0, 16);
						return Buffer.from(result).toString('hex');
					});
				});
			});
		});
	};

	const sleep = Serial.sleep = function(delay) {
		return new Promise(resolve => {
			setTimeout(resolve, delay);
		});
	};

	// `promiseFactories` is an array of functions that return promises. Example usage:
	// 		executePromisesInSeries(things.map(thing => {
	// 			return function() {
	// 				return sleep(1000).then(() => { console.log({thing}); });
	// 			};
	// 		}));
	const executePromisesInSeries = Serial.executePromisesInSeries = function(promiseFactories) {
		let result = Promise.resolve();
		promiseFactories.forEach(promiseFactory => {
			result = result.then(promiseFactory);
		});
		return result;
	};

	const DEFAULT_TIMEOUT = 3000;
	const timeoutPerMb = Serial.timeoutPerMb = function(secondsPerMb, sizeBytes) {
		const result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));
		if (result < DEFAULT_TIMEOUT) {
			return DEFAULT_TIMEOUT;
		}
		return result;
	};

	const pack = Serial.pack = function(format, ...args) {
		let pointer = 0;
		const data = args;
		if (format.replace(/[<>]/, "").length != data.length) {
			throw new Error("Pack format to Argument count mismatch");
		}
		const bytes = [];
		let littleEndian = true;
		for (let i = 0; i < format.length; i++) {
			if (format[i] == "<") {
				littleEndian = true;
			} else if (format[i] == ">") {
				littleEndian = false;
			} else if (format[i] == "B") {
				pushBytes(data[pointer], 1);
				pointer++;
			} else if (format[i] == "H") {
				pushBytes(data[pointer], 2);
				pointer++;
			} else if (format[i] == "I") {
				pushBytes(data[pointer], 4);
				pointer++;
			} else {
				throw new Error("Unhandled character in pack format");
			}
		}
		function pushBytes(value, byteCount) {
			for (let i = 0; i < byteCount; i++) {
				if (littleEndian) {
					bytes.push((value >> (i * 8)) & 0xff);
				} else {
					bytes.push((value >> ((byteCount - i) * 8)) & 0xff);
				}
			}
		}
		return Uint8Array.from(bytes);
	};

	const md5sum = Serial.md5sum = function(firmwareStringBase64) {
		return CryptoJS.MD5(
			CryptoJS.enc.Base64.parse(
				firmwareStringBase64
			)
		).toString();
	};

	Serial.Buffer = Buffer;
	Serial.CryptoJS = CryptoJS;
	Serial.esptool = esptool;

	return Serial;
})();
