(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BleskomatWebSerial = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

module.exports = Buffer;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":21}],2:[function(require,module,exports){
"use strict";

var CryptoJS = require('crypto-js/core');

require('crypto-js/enc-base64');

require('crypto-js/md5');

module.exports = CryptoJS;

},{"crypto-js/core":24,"crypto-js/enc-base64":25,"crypto-js/md5":26}],3:[function(require,module,exports){
"use strict";

module.exports = require('assert');

},{"assert":14}],4:[function(require,module,exports){
"use strict";

module.exports = require('@toit/esptool.js');

},{"@toit/esptool.js":10}],5:[function(require,module,exports){
"use strict";

module.exports = require('events').EventEmitter || require('events');

},{"events":28}],6:[function(require,module,exports){
"use strict";

module.exports = {
  "bootloader": "6QQCIKgGCEDuAAAAAAAAAAAAAAAAAAABGAD/PwQAAAD/////HAD/PxQEAAAAAAAAAAAAgAAAAKAAAADAAAAA4ABQBP+sAAAAJl9ic3Nfc3RhcnQgPD0gJl9ic3NfZW5kAAAAAC9ob21lL3J1bm5lci93b3JrL2VzcDMyLWFyZHVpbm8tbGliLWJ1aWxkZXIvZXNwMzItYXJkdWluby1saWItYnVpbGRlci9lc3AtaWRmL2NvbXBvbmVudHMvYm9vdGxvYWRlcl9zdXBwb3J0L3NyYy9ib290bG9hZGVyX2luaXQuYwAAACZfZGF0YV9zdGFydCA8PSAmX2RhdGFfZW5kAABzcCA8ICZfYnNzX3N0YXJ0AAAAAHNwIDwgJl9kYXRhX3N0YXJ0AAAAYWJvcnQoKSB3YXMgY2FsbGVkIGF0IFBDIDB4JTA4eA0KAAAAYm9vdGxvYWRlcl9pbml0AENhbGN1bGF0ZWQgaGFzaABFeHBlY3RlZCBoYXNoAAAAaGFuZGxlICE9IE5VTEwAAC9ob21lL3J1bm5lci93b3JrL2VzcDMyLWFyZHVpbm8tbGliLWJ1aWxkZXIvZXNwMzItYXJkdWluby1saWItYnVpbGRlci9lc3AtaWRmL2NvbXBvbmVudHMvYm9vdGxvYWRlcl9zdXBwb3J0L3NyYy9ib290bG9hZGVyX3NoYS5jAAAAAGRhdGFfbGVuICUgNCA9PSAwAAAAcGFkX2J5dGVzICUgNCA9PSAwAAB3b3Jkc19oYXNoZWQgJSBCTE9DS19XT1JEUyA9PSA2MC80AAB3b3Jkc19oYXNoZWQgJSBCTE9DS19XT1JEUyA9PSAwAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABib290bG9hZGVyX3NoYTI1Nl9maW5pc2gAAAAAYm9vdGxvYWRlcl9zaGEyNTZfZGF0YQAAYnVmZmVyICE9IE5VTEwAAC9ob21lL3J1bm5lci93b3JrL2VzcDMyLWFyZHVpbm8tbGliLWJ1aWxkZXIvZXNwMzItYXJkdWluby1saWItYnVpbGRlci9lc3AtaWRmL2NvbXBvbmVudHMvYm9vdGxvYWRlcl9zdXBwb3J0L3NyYy9ib290bG9hZGVyX3JhbmRv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",
  "otaSlot": "AQAAAP///////////////////////////////5qYQ0f//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=",
  "partitionsTable": "qlABAgCQAAAAUAAAbnZzAAAAAAAAAAAAAAAAAAAAAACqUAEAAOAAAAAgAABvdGFkYXRhAAAAAAAAAAAAAAAAAKpQABAAAAEAAAAgAGFwcDAAAAAAAAAAAAAAAAAAAAAAqlABggAAIQAAAB8Ac3BpZmZzAAAAAAAAAAAAAAAAAADr6///////////////////qH9fWl8qSJNMGUhxmi3mpv//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"
};

},{}],7:[function(require,module,exports){
"use strict";

module.exports = require('util');

},{"util":46}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var assert = require('../exports/assert');

var Buffer = require('../exports/Buffer');

var CryptoJS = require('../exports/CryptoJS');

var esptool = require('../exports/esptool');

var EventEmitter = require('../exports/events');

var partitionData = function () {
  var data = {};

  var partitionDataBase64 = require('../exports/partitionData');

  Object.entries(partitionDataBase64).forEach(function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        dataBase64 = _ref2[1];

    data[name] = new Uint8Array(Buffer.from(dataBase64, 'base64'));
  });
  return data;
}();

var util = require('../exports/util');

var _require = require('../package.json'),
    version = _require.version;

var clientIncrement = 0;

module.exports = function () {
  var EspLoader = esptool.EspLoader;

  var Serial = function Serial(options) {
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
      bootloader: {
        name: 'bootloader',
        offset: 0x1000
      },
      partitionsTable: {
        name: 'partitions table',
        offset: 0x8000
      },
      otaSlot: {
        name: 'ota app slot',
        offset: 0xe000
      },
      firmware: {
        name: 'firmware',
        offset: 0x10000
      }
    },
    cmd: {
      delimiter: '\n',
      jsonrpc: '2.0'
    }
  };

  Serial.prototype.requestSerialPort = function () {
    var _this = this;

    this.logger.log('Requesting serial port access...');
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
  };

  Serial.prototype.getSerialPort = function (options) {
    var _this2 = this;

    return Promise.resolve().then(function () {
      options = Object.assign({
        open: true
      }, options || {});
      return Promise.resolve().then(function () {
        var port = _this2.port;

        if (!port) {
          return _this2.requestSerialPort();
        } // Port already exists.


        return port;
      }).then(function (port) {
        if (port && options.open) {
          // Port found and we want to open it.
          var baudRate = _this2.options.baudRate;

          _this2.logger.log('Opening serial port...');

          return port.open({
            baudRate: baudRate
          })["catch"](function (error) {
            if (/port is already open/i.test(error.message)) {
              // Ignore port already open error.
              return port;
            } // Re-throw any other error.


            throw error;
          }).then(function () {
            if (port.readable === null) {
              // `readable` becomes null after a fatal error.
              // Close the port then re-open it to recover.
              return port.close().then(function () {
                return _this2.requestSerialPort().then(function (port) {
                  if (port) {
                    return port.open({
                      baudRate: baudRate
                    }).then(function () {
                      return port;
                    });
                  }

                  return null;
                });
              });
            }

            return port;
          }).then(function (port) {
            if (port) {
              port.addEventListener('disconnect', function () {
                _this2.logger.log('Device disconnected');

                _this2.disconnect()["catch"](_this2.logger.error);
              });
            }

            return port;
          });
        }

        return port;
      });
    }).then(function (port) {
      _this2.port = port || null;
      return port;
    });
    ;
  };

  Serial.prototype.connect = function (options) {
    var _this3 = this;

    return Promise.resolve().then(function () {
      options = Object.assign({
        open: true,
        loader: false,
        reconnect: false
      }, options || {});
      assert.ok(!_this3.connected || options.reconnect, 'Already connected');
      return Promise.resolve().then(function () {
        if (options.reconnect) {
          // Disconnect if already connected.
          return _this3.disconnect();
        }
      }).then(function () {
        return _this3.getSerialPort(options);
      }).then(function (port) {
        assert.ok(port, 'Device not found');
        assert.notStrictEqual(port.readable, null, 'Device port not readable');

        if (options.loader) {
          var _this3$options = _this3.options,
              flashSize = _this3$options.flashSize,
              debug = _this3$options.debug;
          var logger = _this3.logger;
          var loader = _this3.loader = new EspLoader(port, {
            flashSize: flashSize,
            debug: debug,
            logger: logger
          });

          _this3.logger.log('Connecting ESPTool loader...');

          return loader.connect().then(function () {
            return loader.chipName().then(function (chipName) {
              _this3.logger.log("Chip Name: \"".concat(chipName, "\""));
            });
          }).then(function () {
            return loader.macAddr().then(function (macAddr) {
              _this3.logger.log("Mac Address: \"".concat(macAddr, "\""));
            });
          }).then(function () {
            _this3.connected = true;

            _this3.logger.log('Connected!');
          });
        }
      });
    })["catch"](function (error) {
      var errorMessage = error instanceof Error ? error.message : error;
      throw new Error("Failed to connect to Bleskomat: ".concat(errorMessage));
    });
  };

  Serial.prototype.disconnect = function () {
    var _this4 = this;

    return Promise.resolve().then(function () {
      var loader = _this4.loader;

      if (loader) {
        _this4.logger.log('Disconnecting ESPTool loader...');

        _this4.stopListening();

        _this4.loader = null;
        return loader.disconnect();
      }
    }).then(function () {
      var port = _this4.port;

      if (port) {
        _this4.logger.log('Closing serial port...');

        _this4.port = null;
        return port.close();
      }
    })["finally"](function () {
      _this4.connected = false;
    });
  };

  Serial.prototype.flash = function (firmware) {
    var _this5 = this;

    return Promise.resolve().then(function () {
      var partitions = _this5.preparePartitions(firmware);

      return _this5.writePartitions(partitions);
    });
  };

  Serial.prototype.preparePartitions = function (firmware) {
    assert.ok(firmware, 'Missing required argument: "firmware"');

    if (typeof firmware === 'string') {
      firmware = Buffer.from(firmware, 'base64');
    }

    if (firmware instanceof Buffer) {
      firmware = new Uint8Array(firmware);
    }

    assert.ok(firmware instanceof Uint8Array, 'Invalid argument ("firmware"): Uint8Array, Buffer, or base64-encoded string expected');
    return Object.entries(this.options.partitions).map(function (_ref3, index) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          partition = _ref4[1];

      var name = partition.name,
          offset = partition.offset;
      var data;

      if (key === 'firmware') {
        // Use firmware binary data provided when calling this function.
        data = firmware;
      } else {
        // Every other partition has fixed binary data.
        data = partitionData[key];
      }

      return {
        data: data,
        name: name,
        offset: offset
      };
    });
  };

  Serial.prototype.writePartitions = function (partitions) {
    var _this6 = this;

    return Promise.resolve().then(function () {
      assert.ok(partitions, 'Missing required argument: "partitions"');
      assert.ok(partitions instanceof Array, 'Invalid argument ("partitions"): Array expected');
      partitions = partitions.map(function (partition) {
        assert.strictEqual(_typeof(partition), 'object', 'Invalid argument ("partitions"): Array of objects expected');
        var data = partition.data,
            name = partition.name,
            offset = partition.offset;
        assert.ok(name, 'Missing required partition property: "name"');
        assert.strictEqual(_typeof(name), 'string', 'Invalid partition property ("name"): String expected');
        assert.ok(data, 'Missing required partition property: "data"');
        assert.ok(data instanceof Uint8Array, 'Invalid partition property ("data"): Uint8Array expected');
        assert.notStrictEqual(_typeof(offset), 'undefined', 'Missing required partition property: "offset"');
        assert.ok(Number.isInteger(offset), 'Invalid partition property ("offset"): Integer expected');
        return partition;
      });
      return _this6.connect({
        loader: true,
        reconnect: true
      }).then(function () {
        var loader = _this6.loader;
        return loader.loadStub().then(function () {
          var _this6$options = _this6.options,
              baudRate = _this6$options.baudRate,
              flashBaudRate = _this6$options.flashBaudRate;
          return loader.setBaudRate(baudRate, flashBaudRate);
        }).then(function () {
          _this6.logger.log('Flashing device...');

          return _this6.promiseAllSeries(partitions.map(function (partition) {
            return function () {
              var data = partition.data,
                  name = partition.name,
                  offset = partition.offset;

              _this6.logger.log("Writing partition: ".concat(name));

              return loader.flashData(data, offset, function (blockIndex, totalBlocks) {
                var blockNumber = blockIndex + 1;

                _this6.logger.log("".concat(name, ": Writing block ").concat(blockNumber, " of ").concat(totalBlocks));
              }).then(function () {
                return _this6.wait(100);
              });
            };
          })).then(function () {
            _this6.logger.log('Successfully wrote device partitions');

            return _this6.hardReset().then(function () {
              return _this6.disconnect();
            });
          });
        });
      });
    });
  };

  var ESP_SPI_FLASH_MD5 = 0x13;
  var MD5_TIMEOUT_PER_MB = 8; // timeout (per megabyte) for calculating md5sum

  Serial.prototype.calculateFlashMD5Sum = function (addr, size) {
    var _this7 = this;

    return Promise.resolve().then(function () {
      return _this7.connect({
        loader: true,
        reconnect: true
      }).then(function () {
        var loader = _this7.loader; // The MD5 command works only when stub is loaded.

        return loader.loadStub().then(function () {
          var opcode = ESP_SPI_FLASH_MD5;

          var buffer = _this7.pack('<IIII', addr, size, 0, 0);

          var checksum = 0;

          var timeout = _this7.timeoutPerMb(MD5_TIMEOUT_PER_MB, size); // The MD5 command returns additional bytes in the standard command reply slot.


          return loader.checkCommand(opcode, buffer, checksum, timeout).then(function (result) {
            result = result.splice(0, 16);
            return Buffer.from(result).toString('hex');
          });
        });
      }).then(function (result) {
        return _this7.hardReset().then(function () {
          return _this7.disconnect();
        }).then(function () {
          return result;
        });
      });
    });
  };

  Serial.prototype.hardReset = function () {
    var _this8 = this;

    return Promise.resolve().then(function () {
      _this8.logger.log('Initiating hard reset...');

      return _this8.getSerialPort({
        open: false
      }).then(function (port) {
        return port.setSignals({
          dataTerminalReady: false,
          requestToSend: true
        }).then(function () {
          return port.setSignals({
            dataTerminalReady: false,
            requestToSend: false
          });
        });
      });
    });
  };

  Serial.prototype.wait = function (delay) {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  }; // `promiseFactories` is an array of functions that return promises. Example usage:
  // 		promiseAllSeries(things.map(thing => {
  // 			return function() {
  // 				return wait(1000).then(() => { console.log({thing}); });
  // 			};
  // 		}));


  Serial.prototype.promiseAllSeries = function (promiseFactories) {
    var result = Promise.resolve();
    promiseFactories.forEach(function (promiseFactory) {
      result = result.then(promiseFactory);
    });
    return result;
  };

  var DEFAULT_TIMEOUT = 3000;

  Serial.prototype.timeoutPerMb = function (secondsPerMb, sizeBytes) {
    var result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));

    if (result < DEFAULT_TIMEOUT) {
      return DEFAULT_TIMEOUT;
    }

    return result;
  };

  Serial.prototype.pack = function (format) {
    var pointer = 0;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var data = args;
    assert.strictEqual(format.replace(/[<>]/, "").length, data.length, 'Pack format to argument count mismatch');
    var bytes = [];
    var littleEndian = true;

    for (var i = 0; i < format.length; i++) {
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
      for (var _i2 = 0; _i2 < byteCount; _i2++) {
        if (littleEndian) {
          bytes.push(value >> _i2 * 8 & 0xff);
        } else {
          bytes.push(value >> (byteCount - _i2) * 8 & 0xff);
        }
      }
    }

    return Uint8Array.from(bytes);
  };

  Serial.prototype.cmd = function (method, params, options) {
    var _this9 = this;

    return Promise.resolve().then(function () {
      assert.ok(method, 'Missing required argument: "method"');
      assert.strictEqual(_typeof(method), 'string', 'Invalid argument ("method"): String expected');
      assert.ok(!params || _typeof(params) === 'object' || params instanceof Array, 'Invalid argument ("params"): Array or Object expected');
      params = params || [];
      options = Object.assign({
        timeout: 500
      }, options || {});
      var port = _this9.port;
      assert.ok(port && port.writable, 'Device not connected');
      assert.ok(!port.writable.locked, 'Device is busy');
      var writer = port.writable.getWriter();
      var id = [_this9.clientId, 'cmd', ++_this9.cmdIncrement].join('-');
      var _this9$options$cmd = _this9.options.cmd,
          delimiter = _this9$options$cmd.delimiter,
          jsonrpc = _this9$options$cmd.jsonrpc;
      var message = JSON.stringify({
        id: id,
        method: method,
        params: params,
        jsonrpc: jsonrpc
      });

      _this9.logger.log("Sending JSON-RPC message: '".concat(message, "'"));

      writer.write(Buffer.from("".concat(message).concat(delimiter), 'utf8'));
      writer.releaseLock();
      return new Promise(function (resolve, reject) {
        try {
          var done = function done(error, result) {
            clearTimeout(timeout);

            _this9.removeListener('message', onMessage);

            if (error) return reject(error);
            resolve(result);
          };

          var timeout = setTimeout(function () {
            done(new Error('Timed-out while waiting for JSON-RPC response'));
          }, options.timeout);

          var onMessage = function onMessage(message) {
            var json;

            try {
              json = JSON.parse(message);
            } catch (error) {// Ignore JSON parsing errors.
            }

            if (json && json.id && json.id === id) {
              if (json.error) return done(new Error(JSON.stringify(json.error)));
              return done(null, json.result || null);
            }
          };

          _this9.on('message', onMessage);
        } catch (error) {
          return reject(error);
        }
      });
    });
  };

  Serial.prototype.startListening = function () {
    var _this10 = this;

    assert.ok(this.loader, 'ESPTool Loader not connected');
    assert.ok(!this.listening, 'Already listening');
    var buffer = '';
    this.listening = {
      unlisten: this.loader.reader.listen(),
      interval: setInterval(function () {
        var data = _this10.loader.reader.buffer.view(true);

        if (data && data.length > 0) {
          buffer += Buffer.from(data).toString('utf8');

          if (buffer) {
            var pos;

            while ((pos = buffer.indexOf('\r\n')) !== -1) {
              var message = buffer.substr(0, pos);

              _this10.emit('message', message);

              buffer = buffer.substr(pos + '\r\n'.length);
            }
          }
        }
      }, 20)
    };
  };

  Serial.prototype.stopListening = function () {
    if (this.listening) {
      var _this$listening = this.listening,
          unlisten = _this$listening.unlisten,
          interval = _this$listening.interval;
      unlisten();
      clearInterval(interval);
      this.listening = null;
    }
  };

  var md5sum = Serial.md5sum = function (firmwareStringBase64) {
    return CryptoJS.MD5(CryptoJS.enc.Base64.parse(firmwareStringBase64)).toString();
  };

  Serial.assert = assert;
  Serial.Buffer = Buffer;
  Serial.CryptoJS = CryptoJS;
  Serial.esptool = esptool;
  Serial.partitionData = partitionData;
  Serial.version = version;
  return Serial;
}();

},{"../exports/Buffer":1,"../exports/CryptoJS":2,"../exports/assert":3,"../exports/esptool":4,"../exports/events":5,"../exports/partitionData":6,"../exports/util":7,"../package.json":48}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./errors":9,"./reader":11,"./stubs":12,"./util":13}],11:[function(require,module,exports){
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

},{"./errors":9,"./util":13}],12:[function(require,module,exports){
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
ESP32.text = (0, util_1.toByteArray)(atob("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"));
ESP32.textStart = 1074520064;
ESP32.entry = 1074521496;
ESP32.data = (0, util_1.toByteArray)(atob("CMD8Pw=="));
ESP32.dataStart = 1073605544;

},{"./util":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":42,"util/":17}],15:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],16:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],17:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":16,"_process":43,"inherits":15}],18:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){

},{}],21:[function(require,module,exports){
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
},{"base64-js":19,"buffer":21,"ieee754":37}],22:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":23,"get-intrinsic":32}],23:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":31,"get-intrinsic":32}],24:[function(require,module,exports){
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
},{"crypto":20}],25:[function(require,module,exports){
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
},{"./core":24}],26:[function(require,module,exports){
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
},{"./core":24}],27:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":32}],28:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],29:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],30:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],31:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":30}],32:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":31,"has":36,"has-symbols":33}],33:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":34}],34:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],35:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":34}],36:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":31}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],39:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":22,"has-tostringtag/shams":35}],40:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":35}],41:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":18,"call-bind/callBound":22,"es-abstract/helpers/getOwnPropertyDescriptor":27,"foreach":29,"has-tostringtag/shams":35}],42:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],43:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],44:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],45:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":39,"is-generator-function":40,"is-typed-array":41,"which-typed-array":47}],46:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":44,"./support/types":45,"_process":43,"inherits":38}],47:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":18,"call-bind/callBound":22,"es-abstract/helpers/getOwnPropertyDescriptor":27,"foreach":29,"has-tostringtag/shams":35,"is-typed-array":41}],48:[function(require,module,exports){
module.exports={
  "name": "bleskomat-web-serial",
  "version": "1.2.0",
  "description": "Connect to a Bleskomat hardware device via WebSerial to listen to serial monitor, flash firmware, and verify md5 checksum.",
  "main": null,
  "private": true,
  "scripts": {
    "build": "make clean all",
    "test": "echo \"Error: no test specified\" && exit 1",
    "test:manual": "npm run build && make test && ./node_modules/.bin/http-server ./public/test/manual"
  },
  "dependencies": {},
  "devDependencies": {
    "@babel/core": "7.17.10",
    "@babel/preset-env": "7.17.10",
    "@toit/esptool.js": "0.12.3",
    "babelify": "10.0.0",
    "browserify": "17.0.0",
    "crypto-js": "4.1.1",
    "http-server": "14.1.0",
    "uglify-js": "3.15.4"
  },
  "author": {
    "name": "Charles Hill",
    "email": "chill@degreesofzero.com"
  },
  "contributors": [
    {
      "name": "Carlos Garcia Ortiz",
      "email": "yo@carlosgarciaortiz.com"
    }
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bleskomat/bleskomat-web-serial.git"
  },
  "license": "UNLICENSED"
}

},{}]},{},[8])(8)
});
