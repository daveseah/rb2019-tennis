// constants
// const SERIAL_PATH = '/dev/tty.usbmodem14201'; // run npm run list from terminal to see serial strings
const SERIAL_PATH = '/dev/cu.usbserial-1410'; // run npm run list from terminal to see serial strings

const F_MULTIFACTOR = 0.05;

// serial.js
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');

//
let SERIAL_P1 = null;
let SERIAL_P2 = null;
let SOCK_GAME = null;
let c_paddle1 = 0;

// configure serial port
SERIAL_P1 = new SerialPort(SERIAL_PATH, { baudRate: 115200 });
const parserP1 = new Readline();
SERIAL_P1.pipe(parserP1);
//
parserP1.on('data', line => {
  let out = '';
  let intPos = parseInt(line, 10) * F_MULTIFACTOR;
  let float = (intPos / 65536) * F_MULTIFACTOR;
  // send to client if changed
  if (c_paddle1 !== intPos) {
    out += `PAD1\t${intPos}`;
    if (SOCK_GAME) SOCK_GAME.send(intPos);
    else out += ' (client offline)';
    console.log(out);
  }
  // update last position
  c_paddle1 = intPos;
});
// tell ARDUINO something happened
SERIAL_P1.write('ARDUINO POWER ON\n');

// configure websocket
const wss = new WebSocket.Server({ port: 8080 });
//
wss.on('connection', ws => {
  console.log('connected server');
  SOCK_GAME = ws;
  SOCK_GAME.send('CONNECT ACK from NODE');
  //
  SOCK_GAME.on('message', message => {
    console.log(`Received message => ${message}`);
  });
});

// start parsing serial and send to browser
