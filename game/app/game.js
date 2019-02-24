/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  PONG source based on Max Wihlborg's YouTube tutorial,
  https://www.youtube.com/watch?v=KApAJhkkqkA
  https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

const DBG = false;

/// LOAD CLASSES //////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const { Player, AIPlayer } = require('./controllers');
const { Ball } = require('./ball');
const { Scoreboard } = require('./scoreboard');

// LOAD MODULES ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const AUDIO = require('./audio');

/// GLOBALS //////////////////// //////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const {
  WIDTH,
  HEIGHT,
  NET_WIDTH,
  BALL_SIZE,
  BALL_SPEED,
  PADDLE_UNITS,
  PADDLE_INPUT_MIN,
  PADDLE_INPUT_MAX,
  PADDLE_HOLE,
  BALL_COLOR,
  PADDLE_COLOR
} = require('./constants');
let INPUTS = {};

/// CREATE PIECES /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let P1 = new Player({ side: -1 });
let P2 = new Player({ side: 1 });
let BALL = new Ball();
let SCOREBOARD = new Scoreboard();
let ADVANTAGE = 1;
let SPAZ_P1 = 0; // LEFT
let SPAZ_P2 = 0; // RIGHT
let SPAZ_T1 = null;
let SPAZ_T2 = null;

/// SET INPUT /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SetInputs(inputOrID, value) {
  // PROTOCOL 1
  if (typeof inputOrID === 'object') {
    if (inputOrID.keystate) INPUTS.keystate = inputOrID.keystate;
    if (inputOrID.id) u_UpdatePaddleInputs(inputOrID.id, inputOrID.value);
    return;
  }
  // PROTOCOL 2
  if (typeof inputOrID === 'string') {
    u_UpdatePaddleInputs(inputOrID, value);
    return;
  }
  // UNKNOWN INPUT
  console.warn(`bad game input`, inputOrID);

  // HELPER FUNCTION
  function u_UpdatePaddleInputs(id, value) {
    if (typeof value !== 'number') {
      console.warn(`${inputOrID}: ${value} is not a number. Bad input!`);
      return;
    }
    // normalize
    if (value < PADDLE_INPUT_MIN) {
      value = PADDLE_INPUT_MIN;
    }
    if (value > PADDLE_INPUT_MAX) {
      value = PADDLE_INPUT_MAX;
    }
    const fValue = value / (PADDLE_INPUT_MAX - PADDLE_INPUT_MIN);
    if (DBG) console.log('normalized', fValue.toFixed(2));
    // rexpand to pixel coordinates
    // range includes the hole for paddings in the corners
    const gap = PADDLE_HOLE * BALL_SIZE;
    const range = HEIGHT - PADDLE_UNITS * BALL_SIZE - gap - gap;
    value = fValue * range + gap;
    if (DBG) console.log(`${range} ${fValue.toFixed(2)} -> ${value.toFixed(2)}`);

    switch (id) {
      case 'L':
        INPUTS.pad1 = value;
        break;
      case 'R':
        INPUTS.pad2 = value;
        break;
      default:
        console.warn(`unknown input id ${id}`);
    }
  }
}

/// INIT //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Init() {
  INPUTS = {};
  SCOREBOARD.Reset();
  ADVANTAGE = 1 - ADVANTAGE;
}

/// START //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Start(side = -1) {
  BALL.Serve(side);
  SPAZ_T1 = setTimeout(SpazP1, 500);
  SPAZ_T2 = setTimeout(SpazP2, 500);
}
let tout;
const mult = (PADDLE_UNITS * BALL_SIZE) / 2;
function SpazP1() {
  if (SPAZ_T1) clearTimeout(SPAZ_T1);
  SPAZ_P1 = Math.floor((0.5 - Math.random()) * mult);
  tout = 100 + Math.random() * 1000;
  if (DBG) console.log('spazP1', SPAZ_P1);
  // console.log('P1 |', SPAZ_P1);
  SPAZ_T1 = setTimeout(SpazP1, tout);
}
function SpazP2() {
  if (SPAZ_T2) clearTimeout(SPAZ_T2);
  SPAZ_P2 = Math.floor((0.5 - Math.random()) * mult);
  tout = 1000 + Math.random() * 2000;
  if (DBG) console.log('spazP2', SPAZ_P2);
  // console.log('| P2', SPAZ_P2);
  SPAZ_T2 = setTimeout(SpazP2, tout);
}
/// UPDATE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const AI_FAST = BALL_SPEED / 32;
const AI_SLOW = BALL_SPEED / 80;

function Update() {
  let status = BALL.Update({ P1, P2 });
  if (status) {
    HandleGameEvent(status);
  }
  P1.Update({
    paddle: INPUTS.pad1,
    ball: BALL,
    twitch: SPAZ_P1,
    autotrack: ADVANTAGE ? AI_FAST : AI_SLOW
  });
  P2.Update({
    paddle: INPUTS.pad2,
    ball: BALL,
    twitch: SPAZ_P2,
    autotrack: ADVANTAGE ? AI_SLOW : AI_FAST
  });
}

/// DRAW //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Draw(ctx) {
  // clear the playfield
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  // draw game elements
  ctx.fillStyle = BALL_COLOR;
  BALL.Draw(ctx);
  ctx.fillStyle = PADDLE_COLOR;
  P1.Draw(ctx);
  P2.Draw(ctx);
  // draw the score
  ctx.fillStyle = BALL_COLOR;
  SCOREBOARD.Draw(ctx);
  // draw the net
  var w = NET_WIDTH;
  var x = (WIDTH - w) * 0.5;
  var y = 0;
  var step = HEIGHT / 20; // how many net segments
  while (y < HEIGHT) {
    ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
    y += step;
  }
  ctx.restore();
}

/// SCORE //////////////////////////////////////////////////////////////////////
function HandleGameEvent(status) {
  switch (status) {
    case 'WIN P1':
      SCOREBOARD.Score(1);
      AUDIO.Point();
      Start(1);
      break;
    case 'WIN P2':
      SCOREBOARD.Score(2);
      AUDIO.Point();
      Start(-1);
      break;
    case 'PADDLE':
      AUDIO.Paddle();
      break;
    case 'BOUNCE':
      AUDIO.Bounce();
      break;
    default:
      if (status) console.log(`unhandled event ${status}`);
  }
  let winner = SCOREBOARD.Won();
  if (winner) {
    Init();
    Start();
  }
}

/// MODULE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = {
  SetInputs,
  Init,
  Start,
  Update,
  Draw
};
