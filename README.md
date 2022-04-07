# bleskomat-web-serial

Connect to a Bleskomat hardware device via WebSerial to listen to serial monitor, flash firmware, and verify md5 checksum.

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

## Manual Testing

Run the following command to prepare manual testing web files and start a local web server:
```bash
npm run test:manual
```
Then open your browser to [localhost:8080](http://localhost:8080).
