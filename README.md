# BleskomatWebSerial

JavaScript library to interact with [Bleskomat hardware devices](https://www.bleskomat.com) in the browser. The [WebSerial](https://web.dev/serial/) API is used to open a serial connection to a hardware device enabling the following:
* Upload (flash) firmware to the device
* Verify md5 checksum of flash memory
* Listen to serial output from the device
* Use the JSON-RPC over serial API of a device running Bleskomat firmware

**Please note** that this library requires the WebSerial browser API. As of the time this library was released, only Chrome/Chromium-based browsers have this API available.

This document's table of contents:
* [Installation](#installation)
* [Usage](#usage)
* [Build Distribution Files](#build-distribution-files)
* [Tests](#tests)
* [Changelog](#changelog)
* [Support](#support)
* [License](#license)
* [Trademark](#trademark)


## Installation

Use npm to install this library in a nodejs project:
```bash
npm install @bleskomat/web-serial
```
Or use the pre-built distribution files found in the `dist` directory.


## Usage

Connect to a Bleskomat hardware device:
```js
const bleskomat = new BleskomatWebSerial();
// This will open a browser dialog which prompts the user to select a serial device.
// If no device is selected, then the promise rejects with an error.
bleskomat.connect().then(() => {
	// Connected!
	console.log('Connected!');
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});
```

Listen to serial monitor:
```js
// `bleskomat` is an instance of nodejs' EventEmitter class.
// It is possible to listen for messages sent by the device via the serial connection.
bleskomat.on('message', message => {
	console.log({ message });
});
```

Flash new firmware on the device:
```js
// `firmware` can be a base64-encoded string, instance of Buffer, or instance of Uint8Array.
const firmware = Buffer.from('').toString('base64');
// All the required partitions are uploaded to the device along with the app.
// e.g. bootloader, ota slot, and partitions table.
bleskomat.flash(firmware).then(() => {
	// Finished flashing firmware to device.
	console.log('Finished flashing firmware!');
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});
```
Pre-built firmware binaries for Bleskomat hardware devices can be found in their source code repositories:
* [bleskomat-diy](https://github.com/bleskomat/bleskomat-diy)
* [bleskomat-pos](https://github.com/bleskomat/bleskomat-pos)

Execute JSON-RPC commands:
```js
// 'echo' sends text to the device which then responds with the same text.
bleskomat.cmd('echo', ['hello!']).then(result => {
	console.log({ result });
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});

// The response from 'getinfo' includes details about installed firmware and other info about the device.
bleskomat.cmd('getinfo').then(result => {
	console.log({ result });
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});

// The response from 'getconfig' is an object containing the device's current configuration.
// e.g. "apiKey.id", "logLevel", etc.
bleskomat.cmd('getconfig').then(result => {
	console.log({ result });
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});

// Use 'setconfig' to change device configurations.
bleskomat.cmd('setconfig', { 'apiKey.id': 'XXX' }).then(result => {
	// `result` will equal true if successful.
	console.log({ result });
}).catch(error => {
	// Something went wrong...
	console.log({ error });
});
```


## Build Distribution Files

[Node.js](https://nodejs.org/en/download/) (w/ npm) and [make](https://www.gnu.org/software/make/) are required to build the library's distribution files.

Download or clone this repository, then install all module dependencies as follows:
```bash
npm ci
```

Now run the build:
```bash
npm run build
```
The distribution files are located in the `./dist` directory.


## Tests

Both automated and manual tests require a Bleskomat-combatible hardware device connected via USB - e.g. an ESP32 devkit, Lilygo T-Display kit, or Bleskomat PCB.


### Automated Tests

The automated tests use [Puppeteer](https://pptr.dev/) to run an instance of Chromium/Chrome browser. Manual selection of the USB device is required. To run the automated tests:
```bash
npm test
```


### Manual Testing

Run the following command to prepare manual testing web files and start a local web server:
```bash
npm run test:manual
```
Then open your browser to [localhost:8080](http://localhost:8080).


## Changelog

See [CHANGELOG.md](https://github.com/bleskomat/bleskomat-web-serial/blob/master/CHANGELOG.md)


## Support

Need some help? Join us in the official [Telegram group](https://t.me/bleskomat) or send us an email at [support@bleskomat.com](mailto:support@bleskomat.com) and we will try our best to respond in a reasonable time. If you have a feature request or bug to report, please [open an issue](https://github.com/bleskomat/bleskomat-web-serial/issues) in this project repository.


## License

The project is licensed under the [GNU General Public License v3 (GPL-3)](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)):
> You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.


## Trademark

"Bleskomat" is a registered trademark. You are welcome to hack, fork, build, and use the source code and instructions found in this repository. However, the right to use the name "Bleskomat" with any commercial products or services is withheld and reserved for the trademark owner.
