// libraries
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const DBG = false;

class ArduinoPaddle {
  constructor(path, baudRate = 115200) {
    this.parser = new Readline();
    if (typeof path !== 'string') throw Error('ArduinoPaddle requires a serial port path');
    this.path = path || null;
    this.baudRate = baudRate;
    this.port = null;
    this.paddle = 0;
    this.rawMode = false;
    this.listener = event => {
      console.log(`${this.port} has no listener`);
    };
  }
  Connect(listener, mode = { raw: false }) {
    if (!this.path) {
      console.log('SERIAL ! error:\n', '       ', 'serial port path not defined');
      return;
    }
    this.port = new SerialPort(this.path, { baudRate: this.baudRate }, err => {
      if (err) {
        console.log('SERIAL ! connection error: \n', '       ', err.message);
        return;
      }
      this.HandleConnect(err);
    });
    this.rawMode = mode.raw;
    if (typeof listener === 'function') this.listener = listener;
  }
  HandleConnect() {
    console.log(`SERIAL ! SERVER CONNECT '${this.path}' at ${this.baudRate} RAW=${this.rawMode}`);
    // set up stream parser
    this.port.pipe(this.parser);
    this.parser.on('data', line => {
      if (this.rawMode) {
        this.listener(line);
        return;
      }
      // got this far: JSON mode
      let id = line.charAt(0);
      // check for comments
      if (id === '!') {
        console.log(`SERIAL ! ${line.substring(1)}`);
        return;
      }
      // if got this far, then it's probably data
      let value = parseInt(line.substring(1), 10);
      if (isNaN(value)) value = 0;
      // send to client if changed
      if (this.paddle !== value && this.listener) {
        if (this.rawMode) this.listener(id, value);
        else this.listener({ id, value });
      }
      // update last position
      this.paddle = value;
    });
  }
}

module.exports = ArduinoPaddle;
