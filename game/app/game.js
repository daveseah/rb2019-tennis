// PONG source based on Max Wihlborg's YouTube tutorial,
// https://www.youtube.com/watch?v=KApAJhkkqkA
// https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

// load controllers and piece classes
const { Player, AIPlayer } = require('./controllers');
const { Ball } = require('./pieces');
const { WIDTH, HEIGHT } = require('./constants');

// global input triggers
let INPUTS = {};

// create new players and pieces
let PLAYER = new Player();
let AI = new AIPlayer();
let BALL = new Ball();

/// SET INPUT /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SetInputs(input) {
  INPUTS.keystate = input.keystate;
  INPUTS.pad0 = input.pad0;
}

/// INIT //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Init() {
  AI.x = WIDTH - (PLAYER.width + AI.width);
  AI.y = (HEIGHT - AI.height) / 2;
  BALL.Serve(1);
}

/// UPDATE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Update() {
  BALL.Update({ PLAYER, AI });
  PLAYER.Update(INPUTS);
  AI.Update({ bally: BALL.y, ballsize: BALL.size });
  INPUTS.pad0 = null;
}

/// DRAW //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Draw(ctx) {
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.fillStyle = '#fff';
  BALL.Draw(ctx);
  PLAYER.Draw(ctx);
  AI.Draw(ctx);
  // draw the net
  var w = 4;
  var x = (WIDTH - w) * 0.5;
  var y = 0;
  var step = HEIGHT / 20; // how many net segments
  while (y < HEIGHT) {
    ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
    y += step;
  }
  ctx.restore();
}

/// MODULE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = {
  SetInputs,
  Init,
  Update,
  Draw
};
