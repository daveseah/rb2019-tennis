const CONFIG = {
  SRI: { SERIAL_PATH: '/dev/tty.usbmodem14101', INPUT_SCALE: 1 },
  EXHIBIT: { SERIAL_PATH: '/dev/cu.usbserial-1410', INPUT_SCALE: 0.3 }
};

// select configuration
const { SERIAL_PATH, INPUT_SCALE } = CONFIG['SRI'];

// libraries
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');

// communication
let SERIAL_P1 = null;
let SERIAL_P2 = null;
let SOCK_GAME = null;

// io values
let c_paddle1 = 0;

// configure serial port
SERIAL_P1 = new SerialPort(SERIAL_PATH, { baudRate: 115200 });
const parserP1 = new Readline();
SERIAL_P1.pipe(parserP1);
//
parserP1.on('data', line => {
  let out = '';
  let intPos = parseInt(line, 10) * INPUT_SCALE;
  if (isNaN(intPos)) intPos = 0;
  let float = (intPos / 65536) * INPUT_SCALE;
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
    console.log(`RECEIVED: '${message}'`);
  });
});
