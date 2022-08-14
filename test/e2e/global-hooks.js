const assert = require('assert');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

const defaultBrowserOptions = {
	args: [
		// Set full-screen to prevent styling issues:
		'--start-fullscreen',
	],
	headless: false,
	slowMo: 100,
	timeout: 5000,
};

let app;
before(function(done) {
	app = express();
	app.custom = {};
	app.custom.server = app.listen(3000, done);
	app.custom.sockets = {};
	let socketIncrement = 0;
	app.custom.server.on('connection', socket => {
		const socketId = (socketIncrement++) + '';
		app.custom.sockets[socketId] = socket;
		socket.once('close', () => {
			app.custom.sockets[socketId] = null;
		});
	});
	app.get('/', (req, res, next) => {
		return Promise.resolve().then(() => {
			const html = '<html><body><textarea cols=50 rows=30></textarea><script src="/bleskomat-web-serial.js"></script></body></html>';
			res.set({
				'content-type': 'text/html',
				'content-length': Buffer.byteLength(html),
			}).status(200).send(html);
		}).catch(next);
	});
	app.get('/bleskomat-web-serial.js', (req, res, next) => {
		return Promise.resolve().then(() => {
			const jsFilePath = path.join(__dirname, '..', '..', 'dist', 'index.js');
			return fs.readFile(jsFilePath).then(contents => {
				res.set({
					'content-type': 'application/javascript',
					'content-length': contents.byteLength,
				}).status(200).send(contents.toString());
			});
		}).catch(next);
	});
});

before(function() {
	const options = Object.assign({}, defaultBrowserOptions);
	return puppeteer.launch(options).then(browser => {
		this.browser = browser;
	});
});

before(function() {
	assert.ok(this.browser, 'Browser not initialized');
	return this.browser.newPage().then(page => {
		this.page = page;
		return page.goto('http://localhost:3000/').then(function() {
			return page.waitForFunction(function() {
				return typeof BleskomatWebSerial !== 'undefined';
			});
		});
	});
});

before(function() {
	this.timeout(60000);
	return this.page.evaluate(() => {
		return Promise.resolve().then(() => {
			const logger = {
				el: document.querySelector('textarea'),
				log: function() {
					const message = Array.prototype.slice.call(arguments).map(arg => {
						if (arg instanceof Error) return arg.message;
						return arg;
					}).join(' ');
					logger.el.textContent += (logger.el.textContent ? '\n' : '') + message;
					logger.el.scrollTop = logger.el.scrollHeight;
				},
				error: function() { logger.log.apply(logger, arguments); },
				debug: function() {},// noop
			};
			const bleskomat = window.bleskomat = new BleskomatWebSerial({ logger });
			bleskomat.on('message', logger.log);
			return bleskomat.connect().then(() => {
				return new Promise((resolve, reject) => {
					const done = function(error) {
						clearTimeout(timeout);
						clearInterval(interval);
						if (error) return reject(error);
						resolve();
					};
					let timeout = setTimeout(() => done(new Error('Timed-out while waiting for JSON-RPC interface')), 20000);
					let interval = setInterval(() => {
						bleskomat.cmd('echo', ['hi']).then(() => done());
					}, 1000);
				});
			});
		});
	});
});

after(function() {
	if (this.page) {
		return this.page.close().then(function() {
			this.page = null;
		});
	}
});

after(function() {
	if (this.browser) {
		return this.browser.close().then(function() {
			this.browser = null;
		});
	}
});

after(function(done) {
	if (!app) return done();
	Object.values(app.custom.sockets).forEach(socket => {
		socket && socket.destroy();
	});
	app.custom.sockets = {};
	app.custom.server.close(done);
	app = null;
});

process.on('SIGINT', function() {
	if (this.browser) {
		const child = this.browser.process();
		child.kill();
	}
});
