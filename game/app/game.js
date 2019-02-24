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
const { WIDTH, HEIGHT, NET_WIDTH, BALL_SIZE, PADDLE_UNITS } = require('./constants');
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
function SetInputs(input) {
  if (input.keystate) INPUTS.keystate = input.keystate;
  if (input.id)
    switch (input.id) {
      case 'L':
        INPUTS.pad1 = input.value;
        break;
      case 'R':
        INPUTS.pad2 = input.value;
        break;
      default:
        console.warn(`unknown input id ${input.id}`);
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
function Update() {
  let status = BALL.Update({ P1, P2 });
  if (status) {
    HandleGameEvent(status);
  }
  P1.Update({
    paddle: INPUTS.pad1,
    ball: BALL,
    twitch: SPAZ_P1,
    autotrack: ADVANTAGE ? 0.25 : 0.1
  });
  P2.Update({
    paddle: INPUTS.pad2,
    ball: BALL,
    twitch: SPAZ_P2,
    autotrack: ADVANTAGE ? 0.1 : 0.25
  });
}

/// DRAW //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Draw(ctx) {
  // clear the playfield
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.fillStyle = '#fff';
  // draw game elements
  BALL.Draw(ctx);
  P1.Draw(ctx);
  P2.Draw(ctx);
  // draw the score
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
