/// REMOTE CONTROLLER SOCKET OVERRIDE /////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// const ALT_SOCKET = null; // no remote server
const ALT_SOCKET = 'ws://192.168.2.221'; // socketserver is not localhost
const ALT_SOCKET_ON = false;

/// LIBRARIES /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const GAME = require('./game');
const AUDIO = require('./audio');
const ALERT = require('./log');

/// CONSTANTS and GLOBALS /////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DBG = false;
// drawing surfaces
let m_canvas, m_ctx;
let m_keystate;
// socket connections
const m_socket_url = ALT_SOCKET_ON ? ALT_SOCKET : `ws://${location.hostname}`;
const m_socket_port = 8080;
let m_socket;
let m_timer;
let m_step;
// module-wide shared constants
const { WIDTH, HEIGHT } = require('./constants');

/// GAME CONTROLLER ///////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Initialize Game Playfields and keyboard inputs, and connect to server
/*/
function BootSystem() {
  ALERT.PrHead('Happy Birthday Ralph Baer!');
  ALERT.PrLn('BOOTING SYSTEM: JUPITER HALL RB-PONG-2019');
  boot_CreateCanvas();
  boot_ConnectKeyboard();
  boot_StartGameWithSocketConnect();
}
/** boot: create graphic surface *********************************************/
function boot_CreateCanvas() {
  // create, initiate and append game canvas
  m_canvas = document.createElement('canvas');
  m_canvas.width = WIDTH;
  m_canvas.height = HEIGHT;
  m_ctx = m_canvas.getContext('2d');
  document.body.appendChild(m_canvas);
}
/** boot: add keyboard input handlers ****************************************/
function boot_ConnectKeyboard() {
  // keep track of keyboard presses
  m_keystate = {};
  document.addEventListener('keydown', function (evt) {
    m_keystate[evt.keyCode] = true;
    GAME.SetInputs(m_keystate);
  });
  document.addEventListener('keyup', function (evt) {
    delete m_keystate[evt.keyCode];
    GAME.SetInputs(m_keystate);
  });
}
/** boot: add remote controller websocket handlers ***************************/
function boot_StartGameWithSocketConnect() {
  // create socket connection to server
  const endpoint = `${m_socket_url}:${m_socket_port}`;
  if (ALT_SOCKET_ON) {
    ALERT.PrWarn(
      'ALT_SOCKET_ON=TRUE. Make sure index.js:ALT_SOCKET is <br/>set to correct URL and remote server is running <br/>or connection will fail.'
    );
    let count = 0;
    m_timer = setInterval(() => {
      ALERT.Pr('.');
      if (++count < 5) return;
      ALERT.PrWarn('TIMEOUT');
      ALERT.PrWarn('Restarting connection process in 5 seconds');
      Reboot();
    }, 3000);
  }
  ALERT.Pr(`Connecting to Controller at ${endpoint}...`);
  m_socket = new WebSocket(endpoint);

  // case 1: run game on successful connection
  m_socket.onopen = () => {
    ALERT.PrLn(`CONNECTED!`);
    ALERT.PrLn(`<br/>*** CONTROLLER LINK ESTABLISHED ***`);
    clearInterval(m_timer);
    m_timer = setTimeout(() => {
      ALERT.Clear();
      // replace alert with 'user must click to enable audio'
      AUDIO.ClickToEnable(document.body);
      ALERT.PrWarn(
        `<br/>* click the screen to enable sound<br/><span style="font-size:smaller">* this message will self-destruct in 10 seconds</span>`
      );
      let temp_timeout = setTimeout(() => {
        clearTimeout(temp_timeout);
        ALERT.Hide();
      }, 10000);
    }, 7000);
    // initialize the game
    Send({ info: 'test client->server connection' });
    InitGame();
    StepGame(0); // m_step = setInterval(StepGame, 1000 / 30);

  };

  // case 2: server isn't running, so alert and retry
  m_socket.onerror = event => {
    clearInterval(m_timer);
    m_timer = null;
    ALERT.PrWarn(`SOCK_ERR`);
  };

  // case 3: server went down
  m_socket.onclose = event => {
    clearInterval(m_timer);
    m_timer = null;
    ALERT.Show();
    ALERT.PrWarn(`<br/>* CONTROL SERVER CONNECTION ERROR (CODE ${event.code}) <br/>* REBOOTING...`);
    ALERT.Pr(`<br/>hint: did you start the controller server with<br><span style='color:#00FF00'>npm run server</span><br>in another terminal?`);
    Reboot();
  };

  // case 4: get a message from the controller server
  m_socket.onmessage = e => {
    const msg = e.data;
    const fchar = msg.charAt(0);
    // support two protocols NON-JSON or JSON
    // first non-JSON
    if (fchar !== '{') {
      let id = fchar;
      let value = Number.parseInt(msg.substring(1));
      if (!isNaN(value)) {
        if (DBG) console.log('RAW', id, value);
        GAME.SetInputs(id, value);
      }
      return;
    }
    // if got this far, hopefully JSON
    let { id, value } = JSON.parse(msg);
    if (!isNaN(value)) {
      if (DBG) console.log('JSON', id, value);
      GAME.SetInputs(id, value);
    }
  };
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Send(pktObj) {
  if (m_socket) {
    const json = JSON.stringify(pktObj);
    console.log('SOCKET SEND', json);
    m_socket.send(json);
  }
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Initialize game data structures
/*/
function InitGame() {
  // initiate data structures
  GAME.Init();
  // initiate runtime
  GAME.Start();
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Start game loop
/*/
function StepGame(timeMS) {
  GAME.Update();
  GAME.Draw(m_ctx);
  window.requestAnimationFrame(StepGame);
}
function Reboot() {
  clearInterval(m_timer);
  m_timer = setTimeout(() => {
    window.location.reload();
  }, 5000);
}

/// DEV: LIVE RELOADING ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (module.hot) {
  // warn server that client is reloading
  module.hot.dispose(function () {
    Send({ info: 'client reloaded' });
  });
  // reload the entire page to keep multiple
  // index.js instances from running until
  // code is completely modularized
  module.hot.accept(function () {
    setTimeout(() => {
      window.location.reload();
    });
  });
}

/// START THE GAME ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
window.addEventListener('load', () => {
  BootSystem();
});

/// EXPORT (to make HMR happy) ////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.export = BootSystem;
