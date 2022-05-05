document.addEventListener('DOMContentLoaded', function() {

	const { assert, Buffer, md5sum } = BleskomatWebSerial;

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

	logger.el && logger.el.addEventListener('scroll', event => {
		logger.userScrolled = (logger.el.scrollTop + logger.el.offsetHeight) <= logger.el.scrollHeight;
	});

	navigator.serial.addEventListener('connect', event => {
		logger.log('A new serial device has been connected');
		console.log('navigator.serial.connect', event);
	});

	navigator.serial.addEventListener('disconnect', event => {
		logger.log('A serial device was disconnected');
		console.log('navigator.serial.disconnect', event);
	});

	const bleskomat = new BleskomatWebSerial({ logger });

	const inputs = {
		loadFirmwareFromFile: document.querySelector('input[name="loadFromFile"]'),
	};

	const buttons = {
		clear: document.querySelector('#clear-button'),
		connect: document.querySelector('#connect-button'),
		flash: document.querySelector('#flash-button'),
		checkmd5sum: document.querySelector('#checkmd5sum-button'),
		jsonRpcSend: document.querySelector('#json-rpc-send-button'),
	};

	buttons['clear'] && buttons['clear'].addEventListener('click', event => {
		event.preventDefault();
		logger.el && (logger.el.textContent = '');
	});

	buttons['connect'] && buttons['connect'].addEventListener('click', event => {
		event.preventDefault();
		bleskomat.connect({ loader: true }).then(() => {
			return bleskomat.hardReset();
		}).then(() => {
			bleskomat.startListening();
		}).catch(logger.error);
	});

	const loadFirmwareFromFile = function() {
		return Promise.resolve().then(() => {
			const file = inputs.loadFirmwareFromFile.files[0];
			assert.ok(file, 'Firmware file (.bin) is required');
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

	buttons['flash'] && buttons['flash'].addEventListener('click', event => {
		event.preventDefault();
		return loadFirmwareFromFile().then(firmware => {
			return bleskomat.flash(firmware);
		}).catch(logger.error);
	});

	buttons['checkmd5sum'] && buttons['checkmd5sum'].addEventListener('click', event => {
		event.preventDefault();
		return loadFirmwareFromFile().then(firmwareUint8Array => {
			const addr = bleskomat.options.partitions.firmware.offset;
			const size = firmwareUint8Array.byteLength;
			return bleskomat.calculateFlashMD5Sum(addr, size).then(actual => {
				const expected = md5sum(Buffer.from(firmwareUint8Array).toString('base64'));
				if (actual === expected) {
					logger.log('Firmware md5sum check OK');
				} else {
					logger.log('Firmware md5sum check FAILED');
				}
				logger.log(`md5sum from device:   ${actual}`);
				logger.log(`firmware.bin md5sum:  ${expected}`);
			});
		}).catch(logger.error);
	});

	buttons['jsonRpcSend'] && buttons['jsonRpcSend'].addEventListener('click', event => {
		event.preventDefault();
		const selectEl = document.querySelector('select[name="json-rpc-method"]');
		const method = selectEl && selectEl.value || null;
		Promise.resolve().then(() => {
			let params;
			if (method === 'echo') {
				params = ["hello!"];
			}
			return bleskomat.cmd(method, params || []);
		}).catch(logger.error);
	});

	bleskomat.on('message', logger.log);

	window.bleskomat = bleskomat;
});
