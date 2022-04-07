document.addEventListener('DOMContentLoaded', function() {

	const logger = {
		el: document.querySelector('#log'),
		log: function() {
			console.log.apply(console, arguments);
			const message = Array.prototype.slice.call(arguments).map(arg => {
				if (arg instanceof Error) {
					return arg.message;
				}
				return arg;
			}).join(' ');
			if (logger.el) {
				if (logger.el.textContent) {
					logger.el.textContent += '\n';
				}
				logger.el.textContent += message;
				if (!logger.userScrolled) {
					logger.el.scrollTop = logger.el.scrollHeight;
				}
			}
		},
		error: function() {
			logger.log.apply(logger, arguments);
			console.log.apply(console, arguments);
		},
		debug: function() {
			console.log.apply(console, arguments);
		},
	};

	logger.el && logger.el.addEventListener('scroll', function(evt) {
		logger.userScrolled = (logger.el.scrollTop + logger.el.offsetHeight) <= logger.el.scrollHeight;
	});

	navigator.serial.addEventListener('connect', function(evt) {
		console.log('navigator.serial.connect', evt);
	});

	navigator.serial.addEventListener('disconnect', function(evt) {
		console.log('navigator.serial.disconnect', evt);
	});

	const { Buffer, md5sum } = BleskomatWebSerial;

	const bleskomat = new BleskomatWebSerial({ logger });

	const inputs = {
		loadFirmwareFromFile: document.querySelector('input[name="loadFromFile"]'),
	};

	const buttons = {
		clear: document.querySelector('#clear-button'),
		monitor: document.querySelector('#monitor-button'),
		flash: document.querySelector('#flash-button'),
		checkmd5sum: document.querySelector('#checkmd5sum-button'),
	};

	buttons['clear'] && buttons['clear'].addEventListener('click', event => {
		event.preventDefault();
		logger.el && (logger.el.textContent = '');
	});

	buttons['monitor'] && buttons['monitor'].addEventListener('click', event => {
		event.preventDefault();
		Promise.resolve().then(() => {
			if (!bleskomat.monitoring) {
				return bleskomat.monitor(logger.log).then(() => {
					buttons['monitor'].textContent = 'Stop Monitor';
				});
			}
			return bleskomat.stopMonitor().then(() => {
				buttons['monitor'].textContent = 'Monitor';
			});
		}).catch(logger.error);
	});

	const loadFirmwareFromFile = function() {
		return Promise.resolve().then(() => {
			const file = inputs.loadFirmwareFromFile.files[0];
			if (!file) {
				throw new Error('Firmware file (.bin) is required');
			}
			return file.arrayBuffer().then(function(arrayBuffer) {
				return new Uint8Array(arrayBuffer);
			});
		});
	};

	const downloadFile = function(name) {
		return fetch('/firmware/' + encodeURIComponent(name), { method: 'GET' })
			.then(response => response.blob())
			.then(blob => blob.arrayBuffer())
			.then(arrayBuffer => new Uint8Array(arrayBuffer));
	};

	const preparePartitions = function(bootloader, partitionsTable, otaSlot, firmware) {
		return [
			{
				name: 'bootloader',
				data: bootloader,
				offset: 0x1000,
			},
			{
				name: 'partitions table',
				data: partitionsTable,
				offset: 0x8000,
			},
			{
				name: 'ota app slot',
				data: otaSlot,
				offset: 0xe000,
			},
			{
				name: 'firmware',
				data: firmware,
				offset: 0x10000,
			},
		];
	};

	buttons['flash'] && buttons['flash'].addEventListener('click', event => {
		event.preventDefault();
		(bleskomat.monitoring && bleskomat.stopMonitor() || Promise.resolve()).then(() => {
			buttons['monitor'].textContent = 'Monitor';
			return downloadFile('bootloader.bin').then(bootloader => {
				return downloadFile('partitions.bin').then(partitionsTable => {
					return downloadFile('ota.bin').then(otaSlot => {
						return loadFirmwareFromFile().then(firmware => {
							const partitions = preparePartitions(bootloader, partitionsTable, otaSlot, firmware);
							console.log({bootloader, partitionsTable, otaSlot, firmware, partitions})
							return bleskomat.flash(partitions);
						});
					});
				});
			});
		}).catch(logger.error);
	});

	buttons['checkmd5sum'] && buttons['checkmd5sum'].addEventListener('click', event => {
		event.preventDefault();
		(bleskomat.monitoring && bleskomat.stopMonitor() || Promise.resolve()).then(() => {
			return loadFirmwareFromFile().then(firmwareUint8Array => {
				console.log(firmwareUint8Array);
				buttons['monitor'].textContent = 'Monitor';
				const addr = 0x10000;
				const size = firmwareUint8Array.byteLength;
				return bleskomat.calculateFlashMD5Sum(addr, size).then(actual => {
					const expected = md5sum(firmwareString);
					if (actual === expected) {
						logger.log('Firmware md5sum check OK');
					} else {
						logger.log('Firmware md5sum check FAILED');
					}
					logger.log(`md5sum from device:   ${actual}`);
					logger.log(`firmware.bin md5sum:  ${expected}`);
				});
			});
		}).catch(logger.error);
	});
});
