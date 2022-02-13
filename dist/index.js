(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BleskomatWebSerial = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

module.exports = Buffer;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":12}],2:[function(require,module,exports){
"use strict";

var CryptoJS = require('crypto-js/core');

require('crypto-js/enc-base64');

require('crypto-js/md5');

module.exports = CryptoJS;

},{"crypto-js/core":13,"crypto-js/enc-base64":14,"crypto-js/md5":15}],3:[function(require,module,exports){
"use strict";

module.exports = require('@toit/esptool.js');

},{"@toit/esptool.js":6}],4:[function(require,module,exports){
"use strict";

var Buffer = require('../exports/Buffer');

var CryptoJS = require('../exports/CryptoJS');

var esptool = require('../exports/esptool.js');

module.exports = function () {
  var EspLoader = esptool.EspLoader;

  var Serial = function Serial(options) {
    this.options = Object.assign({
      baudRate: 115200,
      debug: true,
      flashBaudRate: 460800,
      flashOffset: 0x10000,
      flashPartitionName: 'app0',
      flashSize: 8 * 1024 * 1024,
      logger: console,
      productId: 0xea60,
      vendorId: 0x10c4
    }, options || {});
    this.port = null;
    this.connected = false;
  };

  Serial.prototype.getSerialPort = function () {
    var _this = this;

    return Promise.resolve().then(function () {
      return navigator.serial.getPorts().then(function (ports) {
        if (ports.length > 0) {
          return ports[0];
        }

        var _this$options = _this.options,
            productId = _this$options.productId,
            vendorId = _this$options.vendorId;
        return navigator.serial.requestPort({
          filters: [{
            usbVendorId: vendorId,
            usbProductId: productId
          }]
        });
      });
    });
  };

  Serial.prototype.connect = function () {
    var _this2 = this;

    return Promise.resolve().then(function () {
      // Disconnect if already connected.
      return (_this2.connected && _this2.disconnect() || Promise.resolve()).then(function () {
        return _this2.getSerialPort().then(function (port) {
          if (!port) {
            throw new Error('USB device not found');
          }

          _this2.port = port;
          var baudRate = _this2.options.baudRate;
          return port.open({
            baudRate: baudRate
          }).then(function () {
            var _this2$options = _this2.options,
                flashSize = _this2$options.flashSize,
                debug = _this2$options.debug,
                logger = _this2$options.logger;
            var loader = new EspLoader(port, {
              flashSize: flashSize,
              debug: debug,
              logger: logger
            });
            _this2.loader = loader;
            logger.log('connecting...');
            return loader.connect().then(function () {
              logger.log('connected');
              return loader.chipName().then(function (chipName) {
                _this2.chipName = chipName;
                logger.log("chip: \"".concat(chipName, "\""));
                return loader.macAddr().then(function (macAddr) {
                  _this2.macAddr = macAddr;
                  logger.log("mac address: \"".concat(macAddr, "\""));
                });
              });
            });
          });
        }).then(function () {
          _this2.connected = true;
        })["catch"](function (error) {
          throw new Error("Failed to connect to Bleskomat: ".concat(error.message));
        });
      });
    });
  };

  Serial.prototype.disconnect = function () {
    var _this3 = this;

    return Promise.resolve().then(function () {
      if (!_this3.connected) return;
      return (_this3.loader && _this3.loader.disconnect() || Promise.resolve()).then(function () {
        if (_this3.port) return _this3.port.close();
      })["finally"](function () {
        _this3.connected = false;
        _this3.loader = null;
        _this3.port = null;
      });
    });
  };

  Serial.prototype.flash = function (firmware) {
    var _this4 = this;

    return Promise.resolve().then(function () {
      var firmwareUint8Array;

      if (typeof firmware === 'string') {
        firmwareUint8Array = new Uint8Array(Buffer.from(firmware, 'base64'));
      } else {
        firmwareUint8Array = firmware;
      }

      if (!(firmwareUint8Array instanceof Uint8Array)) {
        throw new Error('Invalid argument ("firmware"): Uint8Array or base64-encoded String expected');
      }

      return _this4.connect().then(function () {
        var loader = _this4.loader;
        return loader.loadStub().then(function () {
          var _this4$options = _this4.options,
              baudRate = _this4$options.baudRate,
              flashBaudRate = _this4$options.flashBaudRate,
              flashOffset = _this4$options.flashOffset,
              flashPartitionName = _this4$options.flashPartitionName,
              logger = _this4$options.logger;
          return loader.setBaudRate(baudRate, flashBaudRate).then(function () {
            var partitions = [{
              name: flashPartitionName,
              // String
              data: firmwareUint8Array,
              // Uint8Array
              offset: flashOffset // Number

            }];
            logger.log('Flashing device...');
            return executePromisesInSeries(partitions.map(function (partition) {
              return function () {
                var data = partition.data,
                    name = partition.name,
                    offset = partition.offset;
                logger.log("Writing partition: ".concat(name));
                return loader.flashData(data, offset, function (blockIndex, totalBlocks) {
                  var blockNumber = blockIndex + 1;
                  logger.log("".concat(name, ": Writing block ").concat(blockNumber, " of ").concat(totalBlocks));
                }).then(function () {
                  return sleep(100);
                });
              };
            })).then(function () {
              logger.log('Successfully wrote device partitions');
              return _this4.disconnect();
            });
          });
        });
      });
    });
  };

  Serial.prototype.monitor = function (onLineCallback) {
    var _this5 = this;

    return Promise.resolve().then(function () {
      if (_this5.monitoring) return;
      return _this5.connect().then(function () {
        var loader = _this5.loader;
        _this5.monitoring = {
          unlisten: loader.reader.listen(),
          textBuffer: '',
          interval: setInterval(function () {
            var data = loader.reader.buffer.view(true);

            if (data && data.length > 0) {
              var text = (_this5.textBuffer || '') + Buffer.from(data).toString('utf8');

              if (text) {
                var pos;

                while ((pos = text.indexOf('\r\n')) !== -1) {
                  var line = text.substr(0, pos);
                  text = text.substr(pos + '\r\n'.length);
                  onLineCallback(line);
                }

                _this5.textBuffer = text;
              }
            }
          }, 100)
        };
      });
    });
  };

  Serial.prototype.stopMonitor = function () {
    var _this6 = this;

    return Promise.resolve().then(function () {
      if (!_this6.monitoring) return;
      clearInterval(_this6.monitoring.interval);

      _this6.monitoring.unlisten();

      _this6.monitoring = null;
      return _this6.disconnect();
    });
  };

  var ESP_SPI_FLASH_MD5 = 0x13;
  var MD5_TIMEOUT_PER_MB = 8; // timeout (per megabyte) for calculating md5sum

  Serial.prototype.calculateFlashMD5Sum = function (addr, size) {
    var _this7 = this;

    return Promise.resolve().then(function () {
      return _this7.connect().then(function () {
        var loader = _this7.loader; // The MD5 command works only when stub is loaded.

        return loader.loadStub().then(function () {
          var opcode = ESP_SPI_FLASH_MD5;
          var buffer = pack('<IIII', addr, size, 0, 0);
          var checksum = 0;
          var timeout = timeoutPerMb(MD5_TIMEOUT_PER_MB, size); // The MD5 command returns additional bytes in the standard command reply slot.

          return loader.checkCommand(opcode, buffer, checksum, timeout).then(function (result) {
            result = result.splice(0, 16);
            return Buffer.from(result).toString('hex');
          });
        });
      });
    });
  };

  var sleep = Serial.sleep = function (delay) {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  }; // `promiseFactories` is an array of functions that return promises. Example usage:
  // 		executePromisesInSeries(things.map(thing => {
  // 			return function() {
  // 				return sleep(1000).then(() => { console.log({thing}); });
  // 			};
  // 		}));


  var executePromisesInSeries = Serial.executePromisesInSeries = function (promiseFactories) {
    var result = Promise.resolve();
    promiseFactories.forEach(function (promiseFactory) {
      result = result.then(promiseFactory);
    });
    return result;
  };

  var DEFAULT_TIMEOUT = 3000;

  var timeoutPerMb = Serial.timeoutPerMb = function (secondsPerMb, sizeBytes) {
    var result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));

    if (result < DEFAULT_TIMEOUT) {
      return DEFAULT_TIMEOUT;
    }

    return result;
  };

  var pack = Serial.pack = function (format) {
    var pointer = 0;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var data = args;

    if (format.replace(/[<>]/, "").length != data.length) {
      throw new Error("Pack format to Argument count mismatch");
    }

    var bytes = [];
    var littleEndian = true;

    for (var i = 0; i < format.length; i++) {
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
      for (var _i = 0; _i < byteCount; _i++) {
        if (littleEndian) {
          bytes.push(value >> _i * 8 & 0xff);
        } else {
          bytes.push(value >> (byteCount - _i) * 8 & 0xff);
        }
      }
    }

    return Uint8Array.from(bytes);
  };

  var md5sum = Serial.md5sum = function (firmwareStringBase64) {
    return CryptoJS.MD5(CryptoJS.enc.Base64.parse(firmwareStringBase64)).toString();
  };

  Serial.Buffer = Buffer;
  Serial.CryptoJS = CryptoJS;
  Serial.esptool = esptool;
  return Serial;
}();

},{"../exports/Buffer":1,"../exports/CryptoJS":2,"../exports/esptool.js":3}],5:[function(require,module,exports){
"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotListeningError = exports.NotRunningError = exports.AlreadyRunningError = exports.ReadAlreadyInProgressError = exports.ConnectError = exports.TimeoutError = exports.ClosedError = exports.UnknownChipFamilyError = void 0;
exports.UnknownChipFamilyError = "Unknown chip family";
exports.ClosedError = "closed";
exports.TimeoutError = "timeout";
exports.ConnectError = "connect error";
exports.ReadAlreadyInProgressError = "Read already in progress";
exports.AlreadyRunningError = "already running";
exports.NotRunningError = "not running";
exports.NotListeningError = "not listening";

},{}],6:[function(require,module,exports){
"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspLoader = exports.ESP_ROM_BAUD = exports.ChipFamily = void 0;
const errors_1 = require("./errors");
const reader_1 = require("./reader");
const stubs_1 = require("./stubs");
const util_1 = require("./util");
var ChipFamily;
(function (ChipFamily) {
    ChipFamily["ESP32"] = "esp32";
    ChipFamily["ESP8266"] = "esp8266";
    ChipFamily["ESP32S2"] = "esp32S2";
})(ChipFamily = exports.ChipFamily || (exports.ChipFamily = {}));
const FLASH_WRITE_SIZE = 0x400;
const STUB_FLASH_WRITE_SIZE = 0x4000;
// Flash sector size, minimum unit of erase.
const FLASH_SECTOR_SIZE = 0x1000;
exports.ESP_ROM_BAUD = 115200;
const SYNC_PACKET = (0, util_1.toByteArray)("\x07\x07\x12 UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
const CHIP_DETECT_MAGIC_REG_ADDR = 0x40001000;
const ESP32_DETECT_MAGIC_VALUE = 0x00f01d83;
const ESP8266_DETECT_MAGIC_VALUE = 0xfff0c101;
const ESP32S2_DETECT_MAGIC_VALUE = 0x000007c6;
const UART_CLKDIV_REG = 0x3ff40014;
const UART_CLKDIV_MASK = 0xfffff;
// Commands supported by ESP8266 ROM bootloader
const ESP_FLASH_BEGIN = 0x02;
const ESP_FLASH_DATA = 0x03;
const ESP_FLASH_END = 0x04;
const ESP_MEM_BEGIN = 0x05;
const ESP_MEM_END = 0x06;
const ESP_MEM_DATA = 0x07;
const ESP_SYNC = 0x08;
const ESP_READ_REG = 0x0a;
const ESP_ERASE_FLASH = 0xd0;
const ESP_SPI_SET_PARAMS = 0x0b;
const ESP_SPI_ATTACH = 0x0d;
const ESP_CHANGE_BAUDRATE = 0x0f;
const ESP_CHECKSUM_MAGIC = 0xef;
const ESP_RAM_BLOCK = 0x1800;
// Timeouts
const DEFAULT_TIMEOUT = 3000; // timeout for most flash operations
const CHIP_ERASE_TIMEOUT = 120000; // timeout for full chip erase
const MAX_TIMEOUT = CHIP_ERASE_TIMEOUT * 2; // longest any command can run
const SYNC_TIMEOUT = 100; // timeout for syncing with bootloader
const ERASE_REGION_TIMEOUT_PER_MB = 30000; // timeout (per megabyte) for erasing a region
const MEM_END_ROM_TIMEOUT = 50;
class EspLoader {
    constructor(serialPort, options) {
        this.isStub = false;
        this.baudRate = exports.ESP_ROM_BAUD;
        this._sendCommandBuffer = new util_1.Uint8BufferSlipEncode();
        this._flashBlockBuffer = new util_1.Uint8Buffer();
        this._memBlockBuffer = new util_1.Uint8Buffer();
        this.options = Object.assign({
            flashSize: 4 * 1024 * 1024,
            logger: console,
            debug: false,
        }, options || {});
        this.reader = new reader_1.Reader(serialPort);
        this.serialPort = serialPort;
    }
    get logger() {
        return this.options.logger;
    }
    async writeToStream(msg) {
        const writer = this.serialPort.writable.getWriter();
        try {
            await writer.write(msg);
        }
        finally {
            writer.releaseLock();
        }
    }
    /**
     * Put into ROM bootload mode & attempt to synchronize with the
     * ESP ROM bootloader, we will retry a few times
     */
    async connect(retries = 7) {
        this.reader.start();
        let connected = false;
        for (let i = 0; i < retries; i++) {
            if (i > 0) {
                this.options.logger.log("retrying...");
            }
            if (await this.try_connect()) {
                connected = true;
                break;
            }
        }
        if (!connected) {
            throw errors_1.ConnectError;
        }
        await this.reader.waitSilent(1, 200);
        await this.chipFamily();
    }
    async try_connect() {
        await this.serialPort.setSignals({ dataTerminalReady: false, requestToSend: true });
        await (0, util_1.sleep)(100);
        await this.serialPort.setSignals({ dataTerminalReady: true, requestToSend: false });
        await (0, util_1.sleep)(50);
        await this.serialPort.setSignals({ dataTerminalReady: false, requestToSend: false });
        // Wait until device has stable output.
        const wasSilent = await this.reader.waitSilent(20, 1000);
        if (!wasSilent) {
            this.options.logger.log("failed to enter bootloader");
            return false;
        }
        this.options.logger.log("trying to sync with bootloader...");
        // Try sync.
        this.options.logger.debug("sync started");
        for (let i = 0; i < 7; i++) {
            try {
                if (await this.sync()) {
                    this.options.logger.log("synced with bootloader");
                    return true;
                }
            }
            catch (e) {
                this.options.logger.debug("sync error", e);
            }
            await (0, util_1.sleep)(50);
        }
        this.options.logger.debug("sync stopped");
        this.options.logger.log("failed to sync with bootloader");
        return false;
    }
    /**
     * shutdown the read loop.
     */
    async disconnect() {
        const err = await this.reader.stop();
        if (err !== undefined) {
            throw err;
        }
    }
    async crystalFrequency() {
        const uart_div = (await this.readRegister(UART_CLKDIV_REG)) & UART_CLKDIV_MASK;
        const ets_xtal = (this.baudRate * uart_div) / 1000000 / 1;
        let norm_xtal;
        if (ets_xtal > 33) {
            norm_xtal = 40;
        }
        else {
            norm_xtal = 26;
        }
        if (Math.abs(norm_xtal - ets_xtal) > 1) {
            this.logger.debug("WARNING: Unsupported crystal in use");
        }
        return norm_xtal;
    }
    /**
     * @name macAddr
     * Read MAC from OTP ROM
     */
    async macAddr() {
        const efuses = await this.efuses();
        const chipFamily = await this.chipFamily();
        const macAddr = new Uint8Array(6).fill(0);
        const mac0 = efuses[0];
        const mac1 = efuses[1];
        const mac2 = efuses[2];
        const mac3 = efuses[3];
        let oui;
        if (chipFamily === ChipFamily.ESP8266) {
            if (mac3 != 0) {
                oui = [(mac3 >> 16) & 0xff, (mac3 >> 8) & 0xff, mac3 & 0xff];
            }
            else if (((mac1 >> 16) & 0xff) == 0) {
                oui = [0x18, 0xfe, 0x34];
            }
            else if (((mac1 >> 16) & 0xff) == 1) {
                oui = [0xac, 0xd0, 0x74];
            }
            else {
                throw "Couldnt determine OUI";
            }
            macAddr[0] = oui[0];
            macAddr[1] = oui[1];
            macAddr[2] = oui[2];
            macAddr[3] = (mac1 >> 8) & 0xff;
            macAddr[4] = mac1 & 0xff;
            macAddr[5] = (mac0 >> 24) & 0xff;
        }
        else if (chipFamily === ChipFamily.ESP32 || chipFamily === ChipFamily.ESP32S2) {
            macAddr[0] = (mac2 >> 8) & 0xff;
            macAddr[1] = mac2 & 0xff;
            macAddr[2] = (mac1 >> 24) & 0xff;
            macAddr[3] = (mac1 >> 16) & 0xff;
            macAddr[4] = (mac1 >> 8) & 0xff;
            macAddr[5] = mac1 & 0xff;
        }
        else {
            throw errors_1.UnknownChipFamilyError;
        }
        let res = macAddr[0].toString(16).toUpperCase().padStart(2, "0");
        for (let i = 1; i < 6; i++) {
            res += ":" + macAddr[i].toString(16).toUpperCase().padStart(2, "0");
        }
        return res;
    }
    /**
     * Read the OTP data for this chip.
     */
    async readEfuses() {
        const chipFamily = await this.chipFamily();
        let baseAddr;
        if (chipFamily == ChipFamily.ESP8266) {
            baseAddr = 0x3ff00050;
        }
        else if (chipFamily === ChipFamily.ESP32 || chipFamily === ChipFamily.ESP32S2) {
            baseAddr = 0x6001a000;
        }
        else {
            throw errors_1.UnknownChipFamilyError;
        }
        const efuses = new Uint32Array(4);
        for (let i = 0; i < 4; i++) {
            efuses[i] = await this.readRegister(baseAddr + 4 * i);
        }
        return efuses;
    }
    async efuses() {
        if (this._efuses === undefined) {
            this._efuses = await this.readEfuses();
        }
        return this._efuses;
    }
    /**
     * Read a register within the ESP chip RAM.
     */
    async readRegister(reg) {
        if (this.options.debug) {
            this.logger.debug("Reading Register", reg);
        }
        const packet = pack("I", reg);
        const register = await this.checkCommand(ESP_READ_REG, packet);
        return unpack("I", register)[0];
    }
    /**
     * ESP32, ESP32S2 or ESP8266 based on which chip type we're talking to.
     */
    async chipFamily() {
        if (this._chipfamily === undefined) {
            const datareg = await this.readRegister(CHIP_DETECT_MAGIC_REG_ADDR);
            if (datareg == ESP32_DETECT_MAGIC_VALUE) {
                this._chipfamily = ChipFamily.ESP32;
            }
            else if (datareg == ESP8266_DETECT_MAGIC_VALUE) {
                this._chipfamily = ChipFamily.ESP8266;
            }
            else if (datareg == ESP32S2_DETECT_MAGIC_VALUE) {
                this._chipfamily = ChipFamily.ESP32S2;
            }
            else {
                throw errors_1.UnknownChipFamilyError;
            }
        }
        return this._chipfamily;
    }
    /**
     * The specific name of the chip.
     */
    async chipName() {
        const efuses = await this.efuses();
        const chipFamily = await this.chipFamily();
        if (chipFamily == ChipFamily.ESP32) {
            return "ESP32";
        }
        if (chipFamily == ChipFamily.ESP32S2) {
            return "ESP32-S2";
        }
        if (chipFamily == ChipFamily.ESP8266) {
            if (efuses[0] & (1 << 4) || efuses[2] & (1 << 16)) {
                return "ESP8285";
            }
            return "ESP8266EX";
        }
        throw errors_1.UnknownChipFamilyError;
    }
    /**
     * Send a command packet, check that the command succeeded.
     */
    async checkCommand(opcode, buffer, checksum = 0, timeout = DEFAULT_TIMEOUT) {
        timeout = Math.min(timeout, MAX_TIMEOUT);
        const unlisten = this.reader.listen();
        try {
            await this.sendCommand(opcode, buffer, checksum);
            const resp = await this.getResponse(opcode, timeout);
            const data = resp.data;
            const value = resp.value;
            if (data.length > 4) {
                return data;
            }
            else {
                return value;
            }
        }
        finally {
            unlisten();
        }
    }
    async sendCommand(opcode, buffer, checksum = 0) {
        const packet = this._sendCommandBuffer;
        packet.reset();
        packet.push(0xc0, 0x00); // direction
        packet.push(opcode);
        packet.pack("H", buffer.length);
        packet.slipEncode = true;
        packet.pack("I", checksum);
        packet.copy(buffer);
        packet.slipEncode = false;
        packet.push(0xc0);
        const res = packet.view();
        if (this.options.debug) {
            this.logger.debug("Writing", res.length, "byte" + (res.length == 1 ? "" : "s") + ":", res);
        }
        await this.writeToStream(res);
    }
    async getResponse(opcode, timeout = DEFAULT_TIMEOUT) {
        try {
            const reply = await this.reader.packet(12, timeout);
            if (this.options.debug) {
                this.logger.debug("Reading", reply.length, "byte" + (reply.length == 1 ? "" : "s") + ":", reply);
            }
            const opcode_ret = reply[1];
            if (opcode !== opcode_ret) {
                this.logger.debug("invalid opcode response. expected", opcode, "got", opcode_ret);
                throw "invalid opcode response";
            }
            const res = Array.from(reply);
            const value = res.slice(4, 8);
            const data = res.slice(8, -1);
            if (this.options.debug) {
                this.logger.debug("value:", value, "data:", data);
            }
            return { value, data };
        }
        catch (e) {
            throw e;
        }
    }
    static checksum(data, state = ESP_CHECKSUM_MAGIC) {
        for (const b of data) {
            state ^= b;
        }
        return state;
    }
    /**
     * Change the baud rate for the serial port.
     */
    async setBaudRate(prevBaud, baud) {
        this.logger.log("Attempting to change baud rate from", prevBaud, "to", baud, "...");
        // Signal ESP32 stub that we will change the baud rate
        const buffer = pack("<II", baud, this.isStub ? prevBaud : 0);
        await this.checkCommand(ESP_CHANGE_BAUDRATE, buffer);
        // Close the read loop and port
        await this.disconnect();
        await this.serialPort.close();
        // Reopen the port and read loop
        await this.serialPort.open({ baudRate: baud });
        this.reader.start();
        await (0, util_1.sleep)(50);
        const wasSilent = await this.reader.waitSilent(10, 200);
        if (!wasSilent) {
            this.logger.debug("after baud change reader was not silent");
        }
        // Baud rate was changed
        this.logger.log("Changed baud rate to", baud);
        this.baudRate = baud;
    }
    /**
     * Put into ROM bootload mode & attempt to synchronize with the
     * ESP ROM bootloader, we will retry a few times
     */
    async sync() {
        const unlisten = this.reader.listen();
        try {
            await this.sendCommand(ESP_SYNC, SYNC_PACKET);
            const { data } = await this.getResponse(ESP_SYNC, SYNC_TIMEOUT);
            if (data.length > 1 && data[0] == 0 && data[1] == 0) {
                return true;
            }
            return false;
        }
        finally {
            unlisten();
        }
    }
    getFlashWriteSize() {
        if (this.isStub) {
            return STUB_FLASH_WRITE_SIZE;
        }
        return FLASH_WRITE_SIZE;
    }
    /**
     * Write data to the flash.
     */
    async flashData(binaryData, offset = 0, progressCallback = undefined, encrypted = false) {
        binaryData = padTo(binaryData, encrypted ? 32 : 4);
        const filesize = binaryData.byteLength;
        this.logger.log("Writing data with filesize:", filesize);
        const blocks = await this.flashBegin(filesize, offset);
        let seq = 0;
        const address = offset;
        let position = 0;
        const stamp = Date.now();
        const flashWriteSize = this.getFlashWriteSize();
        let block;
        while (filesize - position > 0) {
            if (this.options.debug) {
                this.logger.debug("Writing at " + (0, util_1.toHex)(address + seq * flashWriteSize, 8) + "... (", (seq + 1) / blocks, "%)");
            }
            if (progressCallback) {
                progressCallback(seq, blocks);
            }
            if (filesize - position >= flashWriteSize) {
                block = binaryData.subarray(position, position + flashWriteSize);
            }
            else {
                // Pad the last block
                block = binaryData.subarray(position, filesize);
            }
            await this.flashBlock(block, flashWriteSize, seq, 2000);
            seq += 1;
            position += flashWriteSize;
        }
        if (this.isStub) {
            await this.readRegister(CHIP_DETECT_MAGIC_REG_ADDR);
        }
        if (this.options.debug) {
            this.logger.debug("Took", Date.now() - stamp, "ms to write", filesize, "bytes");
        }
    }
    async flashBlock(data, flashWriteSize, seq, timeout = 100) {
        const buffer = this._flashBlockBuffer;
        buffer.reset();
        buffer.pack("<IIII", flashWriteSize, seq, 0, 0);
        buffer.copy(data);
        if (data.length < flashWriteSize) {
            buffer.fill(0xff, flashWriteSize - data.length);
        }
        await this.checkCommand(ESP_FLASH_DATA, buffer.view(), EspLoader.checksum(data), timeout);
    }
    async flashBegin(size = 0, offset = 0, encrypted = false) {
        let eraseSize;
        const buffer = new util_1.Uint8Buffer(32);
        const chipFamily = this.isStub ? null : await this.chipFamily();
        const flashWriteSize = this.getFlashWriteSize();
        if (chipFamily === ChipFamily.ESP32 || chipFamily === ChipFamily.ESP32S2) {
            await this.checkCommand(ESP_SPI_ATTACH, new Uint8Array(8).fill(0));
        }
        if (chipFamily == ChipFamily.ESP32) {
            // We are hardcoded for 4MB flash on ESP32
            buffer.pack("<IIIIII", 0, this.options.flashSize, 0x10000, 4096, 256, 0xffff);
            await this.checkCommand(ESP_SPI_SET_PARAMS, buffer.view());
        }
        const numBlocks = Math.floor((size + flashWriteSize - 1) / flashWriteSize);
        if (chipFamily == ChipFamily.ESP8266) {
            eraseSize = EspLoader.getEraseSize(offset, size);
        }
        else {
            eraseSize = size;
        }
        let timeout;
        if (this.isStub) {
            timeout = DEFAULT_TIMEOUT;
        }
        else {
            timeout = timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, size);
        }
        const stamp = Date.now();
        buffer.reset();
        buffer.pack("<IIII", eraseSize, numBlocks, flashWriteSize, offset);
        if (chipFamily == ChipFamily.ESP32S2) {
            buffer.pack("<I", encrypted ? 1 : 0);
        }
        this.logger.log("Write size", eraseSize, " blocks ", numBlocks, " block size ", flashWriteSize, " offset " + (0, util_1.toHex)(offset, 4) // + ", encrypted " + (encrypted ? "yes" : "no")
        );
        await this.checkCommand(ESP_FLASH_BEGIN, buffer.view(), 0, timeout);
        if (size != 0 && !this.isStub) {
            this.logger.log("Took", Date.now() - stamp, "ms to erase", numBlocks, "bytes");
        }
        return numBlocks;
    }
    /**
     * Leave flash mode and run/reboot
     *
     * @param reboot wheather or not to reboot
     */
    async flashFinish(reboot = false) {
        await this.flashBegin(0, 0);
        const buffer = pack("<I", reboot ? 0 : 1);
        await this.checkCommand(ESP_FLASH_END, buffer);
    }
    /**
     * Calculate an erase size given a specific size in bytes.
     * Provides a workaround for the bootloader erase bug.
     */
    static getEraseSize(offset, size) {
        const sectorsPerBlock = 16;
        const sectorSize = FLASH_SECTOR_SIZE;
        const numSectors = Math.floor((size + sectorSize - 1) / sectorSize);
        const startSector = Math.floor(offset / sectorSize);
        let headSectors = sectorsPerBlock - (startSector % sectorsPerBlock);
        if (numSectors < headSectors) {
            headSectors = numSectors;
        }
        if (numSectors < 2 * headSectors) {
            return Math.floor(((numSectors + 1) / 2) * sectorSize);
        }
        return (numSectors - headSectors) * sectorSize;
    }
    async memBegin(size, blocks, blockSize, offset) {
        if (this.isStub) {
            const chipFamily = await this.chipFamily();
            const stub = getStub(chipFamily);
            const load_start = offset;
            const load_end = offset + size;
            this.logger.log(load_start, load_end);
            this.logger.log(stub.dataStart, stub.data.length, stub.textStart, stub.text.length);
            for (const [start, end] of [
                [stub.dataStart, stub.dataStart + stub.data.length],
                [stub.textStart, stub.textStart + stub.text.length],
            ]) {
                if (load_start < end && load_end > start) {
                    throw ("Software loader is resident at " +
                        (0, util_1.toHex)(start, 8) +
                        "-" +
                        (0, util_1.toHex)(end, 8) +
                        ". " +
                        "Can't load binary at overlapping address range " +
                        (0, util_1.toHex)(load_start, 8) +
                        "-" +
                        (0, util_1.toHex)(load_end, 8) +
                        ". " +
                        "Try changing the binary loading address.");
                }
            }
        }
        return this.checkCommand(ESP_MEM_BEGIN, pack("<IIII", size, blocks, blockSize, offset));
    }
    async memBlock(data, seq) {
        const buffer = this._memBlockBuffer;
        buffer.reset();
        buffer.pack("<IIII", data.length, seq, 0, 0);
        buffer.copy(data);
        return await this.checkCommand(ESP_MEM_DATA, buffer.view(), EspLoader.checksum(data));
    }
    async memFinish(entrypoint = 0) {
        const data = pack("<II", entrypoint === 0 ? 1 : 0, entrypoint);
        await this.checkCommand(ESP_MEM_END, data, 0, MEM_END_ROM_TIMEOUT);
    }
    /**
     * loads the stub onto the device.
     *
     * @param stub Stub to load
     */
    async loadStub(stub) {
        const ramBlock = ESP_RAM_BLOCK;
        const writeMem = async (data, offset) => {
            const length = data.length;
            const blocks = Math.floor((length + ramBlock - 1) / ramBlock);
            await this.memBegin(length, blocks, ramBlock, offset);
            for (let seq = 0; seq < blocks; seq++) {
                const fromOffs = seq * ramBlock;
                let toOffs = fromOffs + ramBlock;
                if (toOffs > length) {
                    toOffs = length;
                }
                await this.memBlock(data.slice(fromOffs, toOffs), seq);
            }
        };
        const chipFamily = await this.chipFamily();
        if (stub === undefined) {
            stub = getStub(chipFamily);
        }
        this.logger.log("Uploading stub...");
        await writeMem(stub.text, stub.textStart);
        await writeMem(stub.data, stub.dataStart);
        this.logger.log("Running stub...");
        const unlisten = this.reader.listen();
        try {
            await this.memFinish(stub.entry);
            const p = await this.reader.packet(6, 1000);
            const str = String.fromCharCode(...p);
            if (str !== "OHAI") {
                throw "Failed to start stub. Unexpected response: " + str;
            }
        }
        finally {
            unlisten();
        }
        this.logger.log("Stub is now running...");
        this.isStub = true;
        this._chipfamily = undefined;
        this._efuses = undefined;
    }
    /**
     * erase the flash of the device
     *
     * @param timeoutMs the timeout of erasing
     */
    async eraseFlash(timeoutMs = CHIP_ERASE_TIMEOUT) {
        if (!this.isStub) {
            throw "Only supported on stub";
        }
        await this.checkCommand(ESP_ERASE_FLASH, emptyByteArray, 0, timeoutMs);
    }
}
exports.EspLoader = EspLoader;
function getStub(chipFamily) {
    switch (chipFamily) {
        case ChipFamily.ESP32:
            return stubs_1.ESP32;
        default:
            throw "Unsupported chipFamily: " + chipFamily;
    }
}
function padTo(image, alignment, padding = 0xff) {
    const pad = image.byteLength % alignment;
    if (pad == 0) {
        return image;
    }
    const res = new Uint8Array(image.byteLength + (alignment - pad));
    res.set(image);
    res.fill(padding, image.byteLength);
    return res;
}
/**
 * Scales timeouts which are size-specific
 */
function timeoutPerMb(secondsPerMb, sizeBytes) {
    const result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));
    if (result < DEFAULT_TIMEOUT) {
        return DEFAULT_TIMEOUT;
    }
    return result;
}
function pack(format, ...args) {
    let pointer = 0;
    const data = args;
    if (format.replace(/[<>]/, "").length != data.length) {
        throw "Pack format to Argument count mismatch";
    }
    const bytes = [];
    let littleEndian = true;
    for (let i = 0; i < format.length; i++) {
        if (format[i] == "<") {
            littleEndian = true;
        }
        else if (format[i] == ">") {
            littleEndian = false;
        }
        else if (format[i] == "B") {
            pushBytes(data[pointer], 1);
            pointer++;
        }
        else if (format[i] == "H") {
            pushBytes(data[pointer], 2);
            pointer++;
        }
        else if (format[i] == "I") {
            pushBytes(data[pointer], 4);
            pointer++;
        }
        else {
            throw "Unhandled character in pack format";
        }
    }
    function pushBytes(value, byteCount) {
        for (let i = 0; i < byteCount; i++) {
            if (littleEndian) {
                bytes.push((value >> (i * 8)) & 0xff);
            }
            else {
                bytes.push((value >> ((byteCount - i) * 8)) & 0xff);
            }
        }
    }
    return Uint8Array.from(bytes);
}
function unpack(format, bytes) {
    let pointer = 0;
    const data = [];
    for (const c of format) {
        if (c == "B") {
            data.push(bytes[pointer] & 0xff);
            pointer += 1;
        }
        else if (c == "H") {
            data.push((bytes[pointer] & 0xff) | ((bytes[pointer + 1] & 0xff) << 8));
            pointer += 2;
        }
        else if (c == "I") {
            data.push((bytes[pointer] & 0xff) |
                ((bytes[pointer + 1] & 0xff) << 8) |
                ((bytes[pointer + 2] & 0xff) << 16) |
                ((bytes[pointer + 3] & 0xff) << 24));
            pointer += 4;
        }
        else {
            throw "Unhandled character in unpack format";
        }
    }
    return data;
}
const emptyByteArray = new Uint8Array();

},{"./errors":5,"./reader":7,"./stubs":8,"./util":9}],7:[function(require,module,exports){
"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completer = exports.Reader = void 0;
const errors_1 = require("./errors");
const util_1 = require("./util");
class Reader {
    constructor(readableOwner) {
        this.running = false;
        this.closing = false;
        this.reader = undefined;
        this.completer = undefined;
        this.runPromise = undefined;
        this.listenRef = 0;
        this.buffer = new util_1.Uint8Buffer();
        this.readableOwner = readableOwner;
    }
    start() {
        if (this.runPromise !== undefined) {
            throw errors_1.AlreadyRunningError;
        }
        this.buffer.reset();
        this.closing = false;
        this.runPromise = this.run();
    }
    async stop() {
        if (this.runPromise === undefined) {
            throw errors_1.NotRunningError;
        }
        this.closing = true;
        if (this.reader !== undefined) {
            try {
                await this.reader.cancel();
            }
            catch (e) { }
        }
        try {
            await this.runPromise;
            return undefined;
        }
        catch (e) {
            return e;
        }
        finally {
            this.buffer.reset();
            this.runPromise = undefined;
        }
    }
    async run() {
        try {
            this.running = true;
            while (!this.closing) {
                if (this.reader === undefined) {
                    this.reader = this.readableOwner.readable.getReader();
                }
                const reader = this.reader;
                try {
                    const { value, done } = await reader.read();
                    if (done) {
                        reader.releaseLock();
                        this.reader = undefined;
                        await (0, util_1.sleep)(1);
                        continue;
                    }
                    if (!value) {
                        continue;
                    }
                    if (this.listenRef > 0) {
                        this.buffer.copy(value);
                    }
                    if (this.completer !== undefined) {
                        this.completer.complete();
                    }
                }
                catch (e) {
                    if (!(0, util_1.isTransientError)(e)) {
                        throw e;
                    }
                    // on a transient error, close the current reader and retry.
                    try {
                        await reader.cancel();
                    }
                    catch (e) { }
                    reader.releaseLock();
                    this.reader = undefined;
                    await (0, util_1.sleep)(1);
                }
            }
        }
        finally {
            if (this.reader !== undefined) {
                try {
                    await this.reader.cancel();
                }
                catch (e) { }
                this.reader.releaseLock();
                this.reader = undefined;
            }
            this.running = false;
        }
    }
    listen() {
        if (!this.running) {
            throw errors_1.NotRunningError;
        }
        this.listenRef++;
        return () => {
            this.listenRef--;
            if (this.listenRef < 0) {
                throw "Listen ref count is negative";
            }
            if (this.listenRef == 0) {
                this.buffer.reset();
            }
        };
    }
    async waitData(minLength, timeoutMs = undefined) {
        if (!this.running) {
            throw errors_1.NotRunningError;
        }
        if (this.completer !== undefined) {
            throw errors_1.ReadAlreadyInProgressError;
        }
        while (this.buffer.length < minLength) {
            this.completer = new Completer(timeoutMs);
            try {
                await this.completer.promise;
            }
            finally {
                this.completer = undefined;
            }
        }
    }
    async waitSilent(retry, timeoutMs) {
        while (retry--) {
            this.buffer.reset();
            try {
                await this.waitData(1, timeoutMs);
            }
            catch (e) {
                if (e === errors_1.TimeoutError) {
                    return true;
                }
                throw e;
            }
            await (0, util_1.sleep)(50);
        }
        return false;
    }
    async read(minLength, timeoutMs) {
        if (this.listenRef <= 0) {
            throw errors_1.NotListeningError;
        }
        await this.waitData(minLength, timeoutMs);
        return this.buffer.view(true);
    }
    async packet(minLength, timeoutMs) {
        if (this.listenRef <= 0) {
            throw errors_1.NotListeningError;
        }
        let maxRetries = 1000;
        while (maxRetries--) {
            await this.waitData(minLength, timeoutMs);
            const res = this.buffer.packet();
            if (res !== undefined) {
                return res;
            }
            // no packet was available in minLength, so we wait for another byte.
            minLength++;
        }
        throw errors_1.TimeoutError;
    }
}
exports.Reader = Reader;
class Completer {
    constructor(timeoutMs = undefined) {
        this.promise = new Promise((resolve, reject) => {
            this._complete = resolve;
            this._reject = reject;
            if (timeoutMs !== undefined) {
                if (timeoutMs > 0) {
                    setTimeout(() => reject(errors_1.TimeoutError), timeoutMs);
                }
                else {
                    reject(errors_1.TimeoutError);
                }
            }
        });
    }
    complete(value) {
        if (this._complete !== undefined) {
            this._complete(value);
        }
    }
    reject(reason) {
        if (this._reject !== undefined) {
            this._reject(reason);
        }
    }
}
exports.Completer = Completer;

},{"./errors":5,"./util":9}],8:[function(require,module,exports){
"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESP32 = void 0;
const util_1 = require("./util");
class ESP32 {
}
exports.ESP32 = ESP32;
ESP32.text = (0, util_1.toByteArray)(atob("CAD0PxwA9D8AAPQ/pOv9PxAA9D82QQAh+v/AIAA4AkH5/8AgACgEICB0nOIGBQAAAEH1/4H2/8AgAKgEiAigoHTgCAALImYC54b0/yHx/8AgADkCHfAAAPgg9D/4MPQ/NkEAkf3/wCAAiAmAgCRWSP+R+v/AIACICYCAJFZI/x3wAAAAECD0PwAg9D8AAAAINkEA5fz/Ifv/DAjAIACJApH7/4H5/8AgAJJoAMAgAJgIVnn/wCAAiAJ88oAiMCAgBB3wAAAAAEA2QQBl/P8Wmv+B7f+R/P/AIACZCMAgAJgIVnn/HfAAAAAAAAEAAIAAmMD9P////wAEIPQ/NkEAIfz/MiIEFkMFZfj/FuoEpfv/OEIM+AwUUfT/N6gLOCKAMxDMM1Hy/xwEiCJAOBEl8/+B8P+AgxAx8P/AIACJAzHS/8AgAFJjAMAgAFgDVnX/OEJAM8A5QjgiSkNJIh3wAJDA/T8IQP0/gIAAAISAAABAQAAASID9P5TA/T82QQCx+P8goHRlrwCW6gWB9v+R9v+goHSQmIDAIACyKQCR8/+QiIDAIACSGACQkPQbycDA9MAgAMJYAJqbwCAAokkAwCAAkhgAger/kJD0gID0h5lGgeT/keX/oej/mpjAIADICbHk/4ecGUYCAHzohxrhRgkAAADAIACJCsAgALkJRgIAwCAAuQrAIACJCZHY/5qIDAnAIACSWAAd8AAAUC0GQDZBAEGz/1g0UDNjFuMDWBRaU1BcQYYAACXs/4hEphgEiCSHpfKl5P8Wmv+oFDDDICCyIIHy/+AIAIw6IqDEKVQoFDoiKRQoNDAywDk0HfAACCD0PwAAQABw4vo/SCQGQPAiBkA2YQCl3f+tAYH8/+AIAD0KDBLs6ogBkqIAkIgQiQFl4v+R8v+h8//AIACICaCIIMAgAIJpALIhAKHv/4Hw/+AIAKAjgx3wAAD/DwAANkEAgYf/kqABkkgAMJxBkmgCkfr/MmgBKTgwMLSaIiozMDxBDAIpWDlIpfj/LQqMGiKgxR3wAAAskgBANkEAgqDArQKHkg6ioNuB+//gCACioNyGAwCCoNuHkgiB9//gCACioN2B9P/gCAAd8AAAADZBADoyBgIAAKICABsi5fv/N5L0HfAAAAAQAABYEAAAfNoFQNguBkCc2gVAHNsFQDYhIaLREIH6/+AIAIYJAABR9v+9AVBDY80ErQKB9v/gCAD8Ks0EvQGi0RCB8//gCABKIkAzwFZj/aHs/7LREBqqge7/4AgAoen/HAsaqiX4/y0DBgEAAAAioGMd8AAAADZBAKKgwIHM/+AIAB3wAABsEAAAaBAAAHAQAAB0EAAAeBAAAPxnAEDQkgBACGgAQDZBIWH5/4H5/xpmSQYaiGLREAwELApZCEJmGoH2/+AIAFHx/4HN/xpVWAVXuAIGNwCtBoHL/+AIAIHt/3Hp/xqIelFZCEYlAIHo/0BzwBqIiAi9AXB4Y80HIKIggcL/4AgAjLpx4P8MBVJmFnpxhgwA5fX/cLcgrQFl7P8l9f/NB70BYKYggbj/4AgAeiJ6RDe00IHW/1B0wBqIiAiHN6cG8P8ADAqiRmyB0f8aiKIoAIHR/+AIAFbq/rGo/6IGbBq7pXsA9+oM9kUJWreiSwAbVYbz/7Kv/reayGZFCFImGje1Ale0qKGd/2C2IBCqgIGf/+AIAKXt/6GY/xwLGqrl4//l7P8sCoG9/+AIAB3wAMD8P09IQUmo6/0/fOELQBTgC0AMAPQ/OED0P///AAAAAAEAjIAAABBAAAAAQAAAAMD8PwTA/D8QJwAAFAD0P/D//wCo6/0/CMD8P7DA/T98aABA7GcAQFiGAEBsKgZAODIGQBQsBkDMLAZATCwGQDSFAEDMkABAeC4GQDDvBUBYkgBATIIAQDbBACHe/wwKImEIQqAAge7/4AgAIdn/Mdr/BgEAQmIASyI3Mvcl4f8MS6LBIKXX/2Xg/zHm/iHm/kHS/yojwCAAOQKx0f8hi/4MDAxaSQKB3//gCABBzf9SoQHAIAAoBCwKUCIgwCAAKQSBfv/gCACB2P/gCAAhxv/AIAAoAsy6HMRAIhAiwvgMFCCkgwwLgdH/4AgA8b//0Ur/wb//saz+4qEADAqBzP/gCAAhvP8MBSozIan+YtIrwCAAKAMWcv/AIAAoAwwUwCAAWQNCQRBCAgEMJ0JBEXJRCVlRJpQHHDd3FB4GCABCAgNyAgKARBFwRCBmRBFIIsAgAEgESVFGAQAAHCRCUQnl0v8Mi6LBEGXJ/0ICA3ICAoBEEXBEIHGg/3Bw9Ee3EqKgwGXE/6Kg7iXE/yXQ/0bf/wByAgEM2ZeXAoafAHc5TmZnAgbJAPZ3IGY3AsZxAPZHCGYnAkZXAAYmAGZHAkaFAGZXAoakAEYiAAyZl5cCxpcAdzkIZncCRqYARh0AZpcChpkADLmXlwJGggAGGQAcOZeXAgZCAHc5Kma3AsZPABwJdzkMDPntBZeXAoY2AMYQABwZl5cCBlcAHCRHlwIGbQCGCwCSoNKXlwLGMgB3ORCSoNCXFySSoNGXFzHGBAAAAJKg05eXAoY6AZKg1JeXAoZIAO0FcqD/RqMADBdWZCiBdP/gCACgdIOGngAAACaEBAwXBpwAQiICciIDcJQgkJC0Vrn+pav/cESAnBoG+P8AoKxBgWj/4AgAVjr9ctfwcKTAzCeGcQAAoID0Vhj+RgQAoKD1gWH/4AgAVir7gUv/gHfAgUr/cKTAdzjkxgMAAKCsQYFY/+AIAFY6+XLX8HCkwFan/kZhAHKgwCaEAoZ9AO0FRlMAAAAmtPUGVAByoAEmtAKGdwCyIgOiIgLlsf8GCQAAcqABJrQCBnIAkTb/QiIEUOUgcqDCR7kCBm4AuFKoIgwXZaX/oHWDxmkADBlmtCxIQqEs/+0FcqDCR7oCBmUAeDK4UqgicHSCmeHlov9BEv6Y4VlkQtQreSSglYN9CQZcAJEN/u0FogkAcqDGFkoWeFmYIkLE8ECZwKKgwJB6kwwKkqDvhgIAAKqysgsYG6qwmTBHKvKiAgVCAgSAqhFAqiBCAgbtBQBEEaCkIEICB4BEAaBEIECZwEKgwZB0k4ZEAEH1/e0FkgQAcqDGFkkQmDRyoMhWyQ+SRAB4VAY9AAAcie0FDBeXFALGOQDoYvhy2FLIQrgyqCKBCP/gCADtCqB1g0YzAAwXJkQCxjAAqCK9BYEA/+AIAIYPAADtBXKgwCa0AgYrAEgieDLAIAB5BAwHhicAZkQCRqj/7QVyoMAGJAAADBcmtAJGIQBB5/6YUngimQRB5f55BH0FhhwAseL+DBfYC0LE8J0FQJeT0HWTcJkQ7QVyoMZWeQWB3P5yoMnICEc8TECgFHKgwFY6BH0KDB+GAgAAepKYaUt3mQqdD3qtcOzARzftFvniqQvpCAaK/wAMF2aEF0HM/ngEjBdyoMhZBAwaQcj+cKWDWQR9Cu0FcKB04mENpY3/4iEN4KB0JY3/JZn/VsfAQgIBcqAPdxRARzcUZkQCRnkAZmQCxn8AJjQChvv+hh8AHCd3lAKGcwBHNwscF3eUAgY6AEb1/gByoNJ3FE9yoNR3FHNG8f4AAAC4MqGu/ngiucGBuv7gCAAhq/6RrP7AIAAoArjBIEQ1wCIRkCIQICQgsLKCrQVwu8KBsf7gCACio+iBrv7gCAAG4P4AANIiBcIiBLIiA6giJZL/Rtv+ALICA0ICAoC7EUC7ILLL8KLCGKVy/wbV/kICA3ICAoBEEXBEIHF6/ULE8Jg3kERjFqSzmBealJCcQQYCAJJhDqVd/5IhDqInBKYaBKgnp6nrpVX/Fpr/oicBQMQgssIYgZH+4AgAFkoAIqDEKVcoF0oiKRcoN0BCwEk3xrv+cgIDkgICgHcRkHcgQsIYcsfwDBwGIACRd/4hev3iKQByYQfgIsAiYQYoJgwaJ7cBDDqZ4anB6dElVv+owSFu/qkB6NGhbf69BMLBHPLBGN0CgXb+4AgAzQq4JqhxmOGgu8C5JqB3wLgJqkSoYaq7C6ygrCC5CaCvBSC7wMya0tuADB7QroMW6gCtApnhycHlYv+Y4cjBKQmBPf0oOIynwJ8xwJnA1ikAVrL21qwAgTj9QqDHSVhGAACMPJwCxov+FsKiQTP9IqDIKVRGiP4AgTD9IqDJKVhGhf4AKCJW8qCtBYFT/uAIAKE//oFN/uAIAIFQ/uAIAEZ9/gAoMhbynq0FgUv+4AgAoqPogUX+4AgA4AIABnb+HfAAADZBAJ0CgqDAKAOHmQ/MMgwShgcADAIpA3zihg4AJhIHJiIWhgMAAACCoNuAKSOHmSYMIikDfPJGBwAioNwnmQgMEikDLQiGAwCCoN188oeZBgwSKQMioNsd8AAA"));
ESP32.textStart = 1074520064;
ESP32.entry = 1074521496;
ESP32.data = (0, util_1.toByteArray)(atob("CMD8Pw=="));
ESP32.dataStart = 1073605544;

},{"./util":9}],9:[function(require,module,exports){
"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransientError = exports.toHex = exports.toByteArray = exports.Uint8BufferSlipEncode = exports.Uint8Buffer = exports.sleep = void 0;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
class Uint8Buffer {
    constructor(size = 64) {
        this.readOffset = 0;
        this.writeOffset = 0;
        this.size = size;
        this._buffer = new ArrayBuffer(this.size);
        this._view = new Uint8Array(this._buffer);
    }
    get length() {
        return this.writeOffset - this.readOffset;
    }
    shift() {
        if (this.length <= 0) {
            return undefined;
        }
        return this._view[this.readOffset++];
    }
    grow(newSize) {
        const newBuffer = new ArrayBuffer(newSize);
        const newView = new Uint8Array(newBuffer);
        newView.set(this._view, 0);
        this.size = newSize;
        this._buffer = newBuffer;
        this._view = newView;
    }
    fill(element, length = 1) {
        this.ensure(length);
        this._view.fill(element, this.writeOffset, this.writeOffset + length);
        this.writeOffset += length;
    }
    ensure(length) {
        if (this.size - this.writeOffset < length) {
            const newSize = this.size + Math.max(length, this.size);
            this.grow(newSize);
        }
    }
    pushBytes(value, byteCount, littleEndian) {
        for (let i = 0; i < byteCount; i++) {
            if (littleEndian) {
                this.push((value >> (i * 8)) & 0xff);
            }
            else {
                this.push((value >> ((byteCount - i) * 8)) & 0xff);
            }
        }
    }
    pack(format, ...args) {
        let pointer = 0;
        const data = args;
        if (format.replace(/[<>]/, "").length != data.length) {
            throw "Pack format to Argument count mismatch";
        }
        let littleEndian = true;
        for (let i = 0; i < format.length; i++) {
            if (format[i] == "<") {
                littleEndian = true;
            }
            else if (format[i] == ">") {
                littleEndian = false;
            }
            else if (format[i] == "B") {
                this.pushBytes(data[pointer], 1, littleEndian);
                pointer++;
            }
            else if (format[i] == "H") {
                this.pushBytes(data[pointer], 2, littleEndian);
                pointer++;
            }
            else if (format[i] == "I") {
                this.pushBytes(data[pointer], 4, littleEndian);
                pointer++;
            }
            else {
                throw "Unhandled character in pack format";
            }
        }
    }
    reset() {
        this.writeOffset = 0;
        this.readOffset = 0;
    }
    push(...bytes) {
        this.ensure(bytes.length);
        this._view.set(bytes, this.writeOffset);
        this.writeOffset += bytes.length;
    }
    copy(bytes) {
        this.ensure(bytes.length);
        this._view.set(bytes, this.writeOffset);
        this.writeOffset += bytes.length;
    }
    /**
     * @name packet
     * returns the bytes between two 0xc0 bytes.
     */
    packet() {
        let dataStart;
        let dataEnd;
        for (let i = this.readOffset; i < this.writeOffset; i++) {
            if (this._view[i] === 0xc0) {
                if (dataStart === undefined) {
                    dataStart = i + 1;
                    // Empty package, normally because of wrong start marker.
                }
                else if (dataStart === i) {
                    dataStart = i + 1;
                }
                else {
                    dataEnd = i;
                    break;
                }
            }
        }
        if (dataEnd === undefined || dataStart === undefined) {
            return undefined;
        }
        this.readOffset = dataEnd + 1;
        const res = new Uint8Array(this._buffer, dataStart, dataEnd - dataStart);
        if (this.readOffset == this.writeOffset) {
            this.reset();
        }
        return res;
    }
    view(reset = true) {
        const res = new Uint8Array(this._buffer, this.readOffset, this.writeOffset);
        if (reset) {
            this.reset();
        }
        return res;
    }
}
exports.Uint8Buffer = Uint8Buffer;
/**
 * @name Uint8BufferSlipEncode
 * makes a Uint8Buffer with slipEncoding mechanisms.
 * When slipEncode is enabled it:
 *  * replaces 0xdb with 0xdb 0xdd
 *  * and 0xc0 with 0xdb 0xdc
 * for all write operations.
 */
class Uint8BufferSlipEncode extends Uint8Buffer {
    constructor() {
        super(...arguments);
        this.slipEncode = false;
    }
    push(...bytes) {
        if (!this.slipEncode) {
            super.push(...bytes);
        }
        else {
            bytes.forEach((v) => this.slipEncodeByte(v));
        }
    }
    reset() {
        this.slipEncode = false;
        super.reset();
    }
    copy(bytes) {
        if (!this.slipEncode) {
            super.copy(bytes);
        }
        else {
            bytes.forEach((v) => this.slipEncodeByte(v));
        }
    }
    /**
     * @name packet
     * returns the bytes between two 0xc0 bytes.
     * decodes slip encoding
     */
    packet(slipDecode = false) {
        const res = super.packet();
        if (res === undefined || !slipDecode) {
            return res;
        }
        let writeOffset = 0;
        for (let i = 0; i < res.byteLength; i++) {
            if (res[i] == 0xdb && i + 1 < res.byteLength && res[i + 1] == 0xdd) {
                res[writeOffset++] = 0xdb;
                i++;
            }
            else if (res[i] == 0xdb && i + 1 < res.byteLength && res[i + 1] == 0xdc) {
                res[writeOffset++] = 0xc0;
                i++;
            }
            else {
                res[writeOffset++] = res[i];
            }
        }
        res.slice(0, writeOffset);
        return res;
    }
    /**
     * @name slipEncodeByte
     * Replaces 0xdb with 0xdb 0xdd and 0xc0 with 0xdb 0xdc
     */
    slipEncodeByte(v) {
        if (v == 0xdb) {
            super.push(0xdb, 0xdd);
        }
        else if (v == 0xc0) {
            super.push(0xdb, 0xdc);
        }
        else {
            super.push(v);
        }
    }
}
exports.Uint8BufferSlipEncode = Uint8BufferSlipEncode;
function toByteArray(str) {
    const byteArray = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        byteArray[i] = charcode & 0xff;
    }
    return byteArray;
}
exports.toByteArray = toByteArray;
function toHex(value, size = 2) {
    return "0x" + value.toString(16).toUpperCase().padStart(size, "0");
}
exports.toHex = toHex;
function isTransientError(e) {
    if (e instanceof DOMException) {
        return (e.name === "BufferOverrunError" ||
            e.name === "BreakError" ||
            e.name === "FramingError" ||
            e.name === "ParityError");
    }
    return false;
}
exports.isTransientError = isTransientError;

},{}],10:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],11:[function(require,module,exports){

},{}],12:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":10,"buffer":12,"ieee754":16}],13:[function(require,module,exports){
(function (global){(function (){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof global !== 'undefined' && global.crypto) {
	        crypto = global.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && typeof require === 'function') {
	        try {
	            crypto = require('crypto');
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            for (var i = 0; i < nBytes; i += 4) {
	                words.push(cryptoSecureRandomInt());
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            var processedWords;

	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"crypto":11}],14:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              var bitsCombined = bits1 | bits2;
	              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	return CryptoJS.enc.Base64;

}));
},{"./core":13}],15:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working varialbes
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));
},{"./core":13}],16:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}]},{},[4])(4)
});
