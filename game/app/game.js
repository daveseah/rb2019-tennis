// PONG source based on Max Wihlborg's YouTube tutorial,
// https://www.youtube.com/watch?v=KApAJhkkqkA
// https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

// load controllers and piece classes
const { Player, AIPlayer } = require('./controllers');
const { Ball } = require('./ball');
const { WIDTH, HEIGHT } = require('./constants');

// global input triggers
let INPUTS = {};

// create new players and pieces
let P1 = new Player();
let P2 = new AIPlayer();
let BALL = new Ball();

/// SET INPUT /////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SetInputs(input) {
  INPUTS.keystate = input.keystate;
  INPUTS.pad1 = input.pad1;
}

/// INIT //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Init() {
  P2.x = WIDTH - (P1.width + P2.width);
  P2.y = (HEIGHT - P2.height) / 2;
  BALL.Serve(1);
}

/// UPDATE ////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Update() {
  BALL.Update({ P1, P2 });
  //  P1.Update({ paddle: INPUTS.pad0, keystate: INPUTS.keystate });
  P1.Update({ paddle: BALL.y });
  P2.Update({ paddle: BALL.y });
  INPUTS.pad1 = null;
}

/// DRAW //////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Draw(ctx) {
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.fillStyle = '#fff';
  BALL.Draw(ctx);
  P1.Draw(ctx);
  P2.Draw(ctx);
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
