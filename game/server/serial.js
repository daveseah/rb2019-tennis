const CONFIG = {
  SRI: { COM1: '/dev/tty.usbmodem14201', COM2: '', BAUDRATE: 115200, RAW: false },
  PI4: { COM1: '/dev/ttyACM0', COM2: '', BAUDRATE: 115200, RAW: true },
  EXHIBIT: { COM1: '/dev/cu.usbserial-1410', BAUDRATE: 115200, RAW: true }
};

const DBG = false;

// select configuration
const { COM1, COM2, BAUDRATE, RAW } = CONFIG['PI4'];

// libraries
const WebSocket = require('ws');
const ArduinoPaddle = require('./arduino-paddle');
const IP = require('ip');

// communication
let SERIAL_P1 = null;
let SERIAL_P2 = null;
let CLIENT_SOCKETS = {};
let CLIENT_ID_COUNTER = 0;

// greeting
console.log('SERVER ! STARTING');

// determine mode
const PADDLE_OUT = RAW ? m_SendPaddleRAW : m_SendPaddleJSON;
// Initialize Communications
if (COM1) {
  SERIAL_P1 = new ArduinoPaddle(COM1, BAUDRATE);
  SERIAL_P1.Connect(PADDLE_OUT, { raw: RAW });
}
if (COM2) {
  SERIAL_P2 = new ArduinoPaddle(COM2, BAUDRATE);
  SERIAL_P2.Connect(PADDLE_OUT, { raw: RAW });
}
// send to all clients
function m_SendPaddleJSON(input) {
  if (DBG) console.log('JSON', input);
  Object.keys(CLIENT_SOCKETS).forEach(key => {
    CLIENT_SOCKETS[key].send(JSON.stringify(input));
  });
}
function m_SendPaddleRAW(rawinput) {
  if (DBG) console.log('RAW', rawinput);
  Object.keys(CLIENT_SOCKETS).forEach(key => {
    CLIENT_SOCKETS[key].send(rawinput);
  });
}

// configure websocket
const WSS = new WebSocket.Server({ port: 8080 });
//
WSS.on('connection', ws => {
  ws.id = ++CLIENT_ID_COUNTER;
  CLIENT_SOCKETS[ws.id] = ws;
  // if got this far, we can save our socket connection and bind serial ports
  console.log(`SOCKET + CONNECTED ${ws.id}`);
  // tell client that they've connected
  ws.send(JSON.stringify({ info: 'SERVER:CONNECTED', sid: ws.id }));

  // socket handlers
  ws.on('message', json => {
    if (json.charAt(0) !== '{') {
      console.warn('SOCKET ! Received malformed JSON', json);
      return;
    }
    console.log(`SOCKET ! ${ws.id} sent ${json}`);
  });
  //
  ws.on('close', () => {
    let id = ws.id;
    if (id) {
      delete CLIENT_SOCKETS[ws.id];
      console.log(`SOCKET - DISCONNECTED ${ws.id}`);
    }
  });
});
//

console.log(`SERVER ! CONTROLLER SOCKET SERVER AT 'ws://${IP.address()}:8080'`);
console.log(`       ! make sure DISPLAY SERVER is configured to use this server`);
console.log(`       ! by editing ALT_SOCKET and ALT_SOCKET_ON constants in index.js`);

console.log(`\n****** ! Run the display server and open the game in CHROME BROWSER`);
