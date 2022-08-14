# bleskomat-web-serial

Connect to a Bleskomat hardware device via WebSerial to listen to serial monitor, flash firmware, run JSON-RPC commands, and verify md5 checksum of flash memory on the device.


## Requirements

Requires nodejs/npm and a few npm packages.

Install npm packages:
```bash
npm ci
```


## Build Distribution Files

```bash
npm run build
```


## Tests

All tests require a Bleskomat-combatible hardware device connected via USB - e.g. an ESP32 devkit, Lilygo T-Display kit, or Bleskomat PCB.

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
