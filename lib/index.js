const assert = require('../exports/assert');
const Buffer = require('../exports/Buffer');
const CryptoJS = require('../exports/CryptoJS');
const esptool = require('../exports/esptool');
const EventEmitter = require('../exports/events');
const partitionData = (function() {
	let data = {};
	const partitionDataBase64 = require('../exports/partitionData');
	Object.entries(partitionDataBase64).forEach(([name, dataBase64], index) => {
		data[name] = new Uint8Array(Buffer.from(dataBase64, 'base64'));
	});
	return data;
})();
const util = require('../exports/util');
const { version } = require('../package.json');

let clientIncrement = 0;

module.exports = (function() {

	const { EspLoader } = esptool;

	const Serial = function(options) {
		this.options = Object.assign({}, this.defaultOptions, options || {});
		this.port = null;
		this.loader = null;
		this.logger = this.options.logger;
		this.connected = false;
		this.clientId = ['client', ++clientIncrement].join('-');
		this.cmdIncrement = 0;
	};

	util.inherits(Serial, EventEmitter);

	Serial.prototype.defaultOptions = {
		baudRate: 115200,
		debug: true,
		flashBaudRate: 921600,
		flashSize: 8 * 1024 * 1024,
		logger: console,
		productId: 0xea60,
		vendorId: 0x10c4,
		partitions: {
			bootloader: { name: 'bootloader', offset: 0x1000 },
			partitionsTable: { name: 'partitions table', offset: 0x8000 },
			otaSlot: { name: 'ota app slot', offset: 0xe000 },
			firmware: { name: 'firmware', offset: 0x10000 },
		},
		cmd: {
			delimiter: '\n',
			jsonrpc: '2.0',
		},
	};

	Serial.prototype.requestSerialPort = function() {
		this.logger.log('Requesting serial port access...');
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
	};

	Serial.prototype.getSerialPort = function(options) {
		return Promise.resolve().then(() => {
			options = Object.assign({
				open: true,
			}, options || {});
			return Promise.resolve().then(() => {
				const { port } = this;
				if (!port) {
					return this.requestSerialPort();
				}
				// Port already exists.
				return port;
			}).then(port => {
				if (port && options.open) {
					// Port found and we want to open it.
					const { baudRate } = this.options;
					this.logger.log('Opening serial port...');
					return port.open({ baudRate }).catch(error => {
						if (/port is already open/i.test(error.message)) {
							// Ignore port already open error.
							return port;
						}
						// Re-throw any other error.
						throw error;
					}).then(() => {
						if (port.readable === null) {
							// `readable` becomes null after a fatal error.
							// Close the port then re-open it to recover.
							return port.close().then(() => {
								return this.requestSerialPort().then(port => {
									if (port) {
										return port.open({ baudRate }).then(() => port);
									}
									return null;
								});
							});
						}
						return port;
					}).then(port => {
						if (port) {
							port.addEventListener('disconnect', () => {
								this.logger.log('Device disconnected');
								this.disconnect().catch(this.logger.error);
							});
						}
						return port;
					});
				}
				return port;
			});
		}).then(port => {
			this.port = port || null;
			return port;
		});;
	};

	Serial.prototype.connect = function(options) {
		return Promise.resolve().then(() => {
			options = Object.assign({
				open: true,
				loader: false,
				reconnect: false,
			}, options || {});
			assert.ok(!this.connected || options.reconnect, 'Already connected');
			return Promise.resolve().then(() => {
				if (options.reconnect) {
					// Disconnect if already connected.
					return this.disconnect();
				}
			}).then(() => {
				return this.getSerialPort(options);
			}).then(port => {
				assert.ok(port, 'Device not found');
				assert.notStrictEqual(port.readable, null, 'Device port not readable');
				if (options.loader) {
					const { flashSize, debug } = this.options;
					const { logger } = this;
					const loader = this.loader = new EspLoader(port, { flashSize, debug, logger });
					this.logger.log('Connecting ESPTool loader...');
					return loader.connect().then(() => {
						return loader.chipName().then(chipName => {
							this.logger.log(`Chip Name: "${chipName}"`);
						});
					}).then(() => {
						return loader.macAddr().then(macAddr => {
							this.logger.log(`Mac Address: "${macAddr}"`);
						});
					}).then(() => {
						this.connected = true;
						this.logger.log('Connected!');
					});
				}
			});
		}).catch(error => {
			const errorMessage = error instanceof Error ? error.message : error;
			throw new Error(`Failed to connect to Bleskomat: ${errorMessage}`);
		});
	};

	Serial.prototype.disconnect = function() {
		return Promise.resolve().then(() => {
			const { loader } = this;
			if (loader) {
				this.logger.log('Disconnecting ESPTool loader...');
				this.stopListening();
				this.loader = null;
				return loader.disconnect();
			}
		}).then(() => {
			const { port } = this;
			if (port) {
				this.logger.log('Closing serial port...');
				this.port = null;
				return port.close();
			}
		}).finally(() => {
			this.connected = false;
		});
	};

	Serial.prototype.flash = function(firmware) {
		return Promise.resolve().then(() => {
			const partitions = this.preparePartitions(firmware);
			return this.writePartitions(partitions);
		});
	};

	Serial.prototype.preparePartitions = function(firmware) {
		assert.ok(firmware, 'Missing required argument: "firmware"');
		if (typeof firmware === 'string') {
			firmware = Buffer.from(firmware, 'base64');
		}
		if (firmware instanceof Buffer) {
			firmware = new Uint8Array(firmware);
		}
		assert.ok(firmware instanceof Uint8Array, 'Invalid argument ("firmware"): Uint8Array, Buffer, or base64-encoded string expected');
		return Object.entries(this.options.partitions).map(([key, partition], index) => {
			const { name, offset } = partition;
			let data;
			if (key === 'firmware') {
				// Use firmware binary data provided when calling this function.
				data = firmware;
			} else {
				// Every other partition has fixed binary data.
				data = partitionData[key];
			}
			return { data, name, offset };
		});
	};

	Serial.prototype.writePartitions = function(partitions) {
		return Promise.resolve().then(() => {
			assert.ok(partitions, 'Missing required argument: "partitions"');
			assert.ok(partitions instanceof Array, 'Invalid argument ("partitions"): Array expected');
			partitions = partitions.map(partition => {
				assert.strictEqual(typeof partition, 'object', 'Invalid argument ("partitions"): Array of objects expected');
				let { data, name, offset } = partition;
				assert.ok(name, 'Missing required partition property: "name"');
				assert.strictEqual(typeof name, 'string', 'Invalid partition property ("name"): String expected');
				assert.ok(data, 'Missing required partition property: "data"');
				assert.ok(data instanceof Uint8Array, 'Invalid partition property ("data"): Uint8Array expected');
				assert.notStrictEqual(typeof offset, 'undefined', 'Missing required partition property: "offset"');
				assert.ok(Number.isInteger(offset), 'Invalid partition property ("offset"): Integer expected');
				return partition;
			});
			return this.connect({ loader: true, reconnect: true }).then(() => {
				const { loader } = this;
				return loader.loadStub().then(() => {
					const { baudRate, flashBaudRate } = this.options;
					return loader.setBaudRate(baudRate, flashBaudRate);
				}).then(() => {
					this.logger.log('Flashing device...');
					return this.promiseAllSeries(partitions.map(partition => {
						return () => {
							const { data, name, offset } = partition;
							this.logger.log(`Writing partition: ${name}`);
							return loader.flashData(data, offset, (blockIndex, totalBlocks) => {
								const blockNumber = blockIndex + 1;
								this.logger.log(`${name}: Writing block ${blockNumber} of ${totalBlocks}`);
							}).then(() => {
								return this.wait(100);
							});
						};
					})).then(() => {
						this.logger.log('Successfully wrote device partitions');
						return this.hardReset().then(() => this.disconnect());
					});
				});
			});
		});
	};

	const ESP_SPI_FLASH_MD5 = 0x13;
	const MD5_TIMEOUT_PER_MB = 8;// timeout (per megabyte) for calculating md5sum
	Serial.prototype.calculateFlashMD5Sum = function(addr, size) {
		return Promise.resolve().then(() => {
			return this.connect({ loader: true, reconnect: true }).then(() => {
				const { loader } = this;
				// The MD5 command works only when stub is loaded.
				return loader.loadStub().then(() => {
					const opcode = ESP_SPI_FLASH_MD5;
					const buffer = this.pack('<IIII', addr, size, 0, 0);
					const checksum = 0;
					const timeout = this.timeoutPerMb(MD5_TIMEOUT_PER_MB, size);
					// The MD5 command returns additional bytes in the standard command reply slot.
					return loader.checkCommand(opcode, buffer, checksum, timeout).then(result => {
						result = result.splice(0, 16);
						return Buffer.from(result).toString('hex');
					});
				});
			}).then(result => {
				return this.hardReset().then(() => this.disconnect()).then(() => result);
			});
		});
	};

	Serial.prototype.hardReset = function() {
		return Promise.resolve().then(() => {
			this.logger.log('Initiating hard reset...');
			return this.getSerialPort({ open: false }).then(port => {
				return port.setSignals({
					dataTerminalReady: false,
					requestToSend: true,
				}).then(() => {
					return port.setSignals({
						dataTerminalReady: false,
						requestToSend: false,
					});
				});
			});
		})
	};

	Serial.prototype.wait = function(delay) {
		return new Promise(resolve => {
			setTimeout(resolve, delay);
		});
	};

	// `promiseFactories` is an array of functions that return promises. Example usage:
	// 		promiseAllSeries(things.map(thing => {
	// 			return function() {
	// 				return wait(1000).then(() => { console.log({thing}); });
	// 			};
	// 		}));
	Serial.prototype.promiseAllSeries = function(promiseFactories) {
		let result = Promise.resolve();
		promiseFactories.forEach(promiseFactory => {
			result = result.then(promiseFactory);
		});
		return result;
	};

	const DEFAULT_TIMEOUT = 3000;
	Serial.prototype.timeoutPerMb = function(secondsPerMb, sizeBytes) {
		const result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));
		if (result < DEFAULT_TIMEOUT) {
			return DEFAULT_TIMEOUT;
		}
		return result;
	};

	Serial.prototype.pack = function(format, ...args) {
		let pointer = 0;
		const data = args;
		assert.strictEqual(format.replace(/[<>]/, "").length, data.length, 'Pack format to argument count mismatch');
		let bytes = [];
		let littleEndian = true;
		for (let i = 0; i < format.length; i++) {
			if (format[i] === '<') {
				littleEndian = true;
			} else if (format[i] === '>') {
				littleEndian = false;
			} else if (format[i] === 'B') {
				pushBytes(data[pointer], 1);
				pointer++;
			} else if (format[i] === 'H') {
				pushBytes(data[pointer], 2);
				pointer++;
			} else if (format[i] === 'I') {
				pushBytes(data[pointer], 4);
				pointer++;
			} else {
				throw new Error('Unhandled character in pack format');
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

	Serial.prototype.cmd = function(method, params, options) {
		return Promise.resolve().then(() => {
			assert.ok(method, 'Missing required argument: "method"');
			assert.strictEqual(typeof method, 'string', 'Invalid argument ("method"): String expected');
			assert.ok(!params || typeof params === 'object' || params instanceof Array, 'Invalid argument ("params"): Array or Object expected');
			params = params || [];
			options = Object.assign({
				timeout: 500,
			}, options || {});
			const { port } = this;
			assert.ok(port && port.writable, 'Device not connected');
			assert.ok(!port.writable.locked, 'Device is busy');
			const writer = port.writable.getWriter();
			const id = [this.clientId, 'cmd', ++this.cmdIncrement].join('-');
			const { delimiter, jsonrpc } = this.options.cmd;
			const message = JSON.stringify({ id, method, params, jsonrpc });
			this.logger.log(`Sending JSON-RPC message: '${message}'`);
			writer.write(Buffer.from(`${message}${delimiter}`, 'utf8'));
			writer.releaseLock();
			return new Promise((resolve, reject) => {
				try {
					const done = (error, result) => {
						clearTimeout(timeout);
						this.removeListener('message', onMessage);
						if (error) return reject(error);
						resolve(result);
					};
					const timeout = setTimeout(() => {
						done(new Error('Timed-out while waiting for JSON-RPC response'));
					}, options.timeout);
					const onMessage = message => {
						let json;
						try { json = JSON.parse(message); } catch (error) {
							// Ignore JSON parsing errors.
						}
						if (json && json.id && json.id === id) {
							if (json.error) return done(new Error(JSON.stringify(json.error)));
							return done(null, json.result || null);
						}
					};
					this.on('message', onMessage);
				} catch (error) {
					return reject(error);
				}
			});
		});
	};

	Serial.prototype.startListening = function() {
		assert.ok(this.loader, 'ESPTool Loader not connected');
		assert.ok(!this.listening, 'Already listening');
		let buffer = '';
		this.listening = {
			unlisten: this.loader.reader.listen(),
			interval: setInterval(() => {
				const data = this.loader.reader.buffer.view(true);
				if (data && data.length > 0) {
					buffer += Buffer.from(data).toString('utf8');
					if (buffer) {
						let pos;
						while ((pos = buffer.indexOf('\r\n')) !== -1) {
							const message = buffer.substr(0, pos);
							this.emit('message', message);
							buffer = buffer.substr(pos + '\r\n'.length);
						}
					}
				}
			}, 20),
		};
	};

	Serial.prototype.stopListening = function() {
		if (this.listening) {
			const { unlisten, interval } = this.listening;
			unlisten();
			clearInterval(interval);
			this.listening = null;
		}
	};

	const md5sum = Serial.md5sum = function(firmwareStringBase64) {
		return CryptoJS.MD5(
			CryptoJS.enc.Base64.parse(
				firmwareStringBase64
			)
		).toString();
	};

	Serial.assert = assert;
	Serial.Buffer = Buffer;
	Serial.CryptoJS = CryptoJS;
	Serial.esptool = esptool;
	Serial.partitionData = partitionData;
	Serial.version = version;

	return Serial;
})();
