/// LIBRARIES /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const GAME = require('./game');
const AUDIO = require('./audio');

/// CONSTANTS and GLOBALS /////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// drawing surfaces
let m_canvas, m_ctx;
let m_keystate;
// socket connections
const m_socket_url = 'ws://localhost:8080';
let m_socket;
// module-wide shared constants
const { WIDTH, HEIGHT } = require('./constants');

/// GAME CONTROLLER ///////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ Initialize Game Playfields and keyboard inputs, and connect to server
/*/
function BootSystem() {
  // create, initiate and append game canvas
  m_canvas = document.createElement('canvas');
  m_canvas.width = WIDTH;
  m_canvas.height = HEIGHT;
  m_ctx = m_canvas.getContext('2d');
  document.body.appendChild(m_canvas);
  // user must click to enable audio
  AUDIO.ClickToEnable(m_canvas);

  // keep track of keyboard presses
  m_keystate = {};
  document.addEventListener('keydown', function(evt) {
    m_keystate[evt.keyCode] = true;
    GAME.SetInputs(m_keystate);
  });
  document.addEventListener('keyup', function(evt) {
    delete m_keystate[evt.keyCode];
    GAME.SetInputs(m_keystate);
  });
  // create socket connection to server
  m_socket = new WebSocket(m_socket_url);
  // case 1: run game on successful connection
  m_socket.onopen = () => {
    m_socket.send('client : open connection');
    InitGame();
    StepGame();
  };
  // case 2: server isn't running, so alert and retry
  m_socket.onerror = error => {
    console.log(`WebSocket error:`, error);
  };
  // case 3: received a control from server
  m_socket.onmessage = e => {
    // HACK: expects an integer; ignore non numbers
    const msg = e.data;
    let val = parseInt(msg, 10);
    if (!isNaN(val)) GAME.SetInputs({ pad1: val });
  };
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
function StepGame() {
  GAME.Update();
  GAME.Draw(m_ctx);
  window.requestAnimationFrame(StepGame, m_canvas);
}

/// DEV: LIVE RELOADING ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if (module.hot) {
  // warn server that client is reloading
  module.hot.dispose(function() {
    m_socket.send('client : reloaded page');
  });
  // reload the entire page to keep multiple
  // index.js instances from running until
  // code is completely modularized
  module.hot.accept(function() {
    setTimeout(() => {
      window.location.reload();
    });
  });
}

/// START THE GAME ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
BootSystem();
