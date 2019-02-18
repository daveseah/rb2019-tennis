const CONFIG = {
  SRI: { COM1: '/dev/tty.usbmodem14101', COM2: '', INPUT_SCALE: 1, BAUDRATE: 115200 },
  EXHIBIT: { COM1: '/dev/cu.usbserial-1410', INPUT_SCALE: 0.3, BAUDRATE: 115200 }
};

// select configuration
const { COM1, COM2, INPUT_SCALE, BAUDRATE } = CONFIG['SRI'];

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

// greeting
console.log('SERVER ! STARTING');

// configure serial port
const parserP1 = new Readline();
if (COM1) {
  SERIAL_P1 = new SerialPort(COM1, { baudRate: BAUDRATE }, err => {
    if (err) {
      console.log('SERIAL ! ERROR connecting to COM1\n', '       ', err.message);
      return;
    }
    console.log(`SERIAL ! CONNECTED '${COM1}' at ${BAUDRATE} ...`);

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
  });
}
const parserP2 = new Readline();

// configure websocket
const wss = new WebSocket.Server({ port: 8080 });
//
wss.on('connection', ws => {
  console.log('SOCKET ! CONNECTED');
  SOCK_GAME = ws;
  SOCK_GAME.send('SERVER:CONNECTED');
  //
  SOCK_GAME.on('message', message => {
    console.log(`${message}`);
  });
});
console.log('SERVER ! WEBSOCKET SERVICE on 8080');
