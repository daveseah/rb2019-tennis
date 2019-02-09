// serial.js
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');

//
let SERIAL_P1 = null;
let SERIAL_P2 = null;
let SOCK_GAME = null;

// configure serial port
const SERIAL_PATH = '/dev/tty.usbmodem14201';
SERIAL_P1 = new SerialPort(SERIAL_PATH, { baudRate: 115200 });
const parserP1 = new Readline();
SERIAL_P1.pipe(parserP1);
//
parserP1.on('data', line => {
  if (SOCK_GAME) SOCK_GAME.send(line);
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
