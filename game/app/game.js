/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  PONG source based on Max Wihlborg's YouTube tutorial,
  https://www.youtube.com/watch?v=KApAJhkkqkA
  https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

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
const { WIDTH, HEIGHT, NET_WIDTH } = require('./constants');
let INPUTS = {};

/// CREATE PIECES /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let P1 = new Player({ side: -1 });
let P2 = new Player({ side: 1 });
let BALL = new Ball();
let SCOREBOARD = new Scoreboard();

/// SET INPUT /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SetInputs(input) {
  INPUTS.keystate = input.keystate;
  INPUTS.pad1 = input.pad1;
  INPUTS.pad2 = input.pad2;
}

/// INIT //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Init() {
  INPUTS = {};
  SCOREBOARD.Reset();
}

/// START //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Start(side = -1) {
  BALL.Serve(side);
}

/// UPDATE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Update() {
  let status = BALL.Update({ P1, P2 });
  if (status) {
    HandleGameEvent(status);
  }
  P1.Update({ paddle: INPUTS.pad1, ball: BALL, autotrack: 0.01 });
  P2.Update({ paddle: INPUTS.pad2, ball: BALL, autotrack: 0.1 });
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
