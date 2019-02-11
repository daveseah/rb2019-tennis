/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  PONG source based on Max Wihlborg's YouTube tutorial,
  https://www.youtube.com/watch?v=KApAJhkkqkA
  https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

/// LOAD CLASSES //////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const { Player, AIPlayer } = require('./controllers');
const { Ball } = require('./ball');
const { WIDTH, HEIGHT, END_SCORE, NET_WIDTH } = require('./constants');

/// GLOBAL INPUT STATE and SCORE //////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let INPUTS = {};
let SCORES = {
  P1: 0,
  P2: 0
};

/// CREATE PIECES /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let P1 = new Player({ side: -1 });
let P2 = new Player({ side: 1 });
let BALL = new Ball();

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
  EraseScore();
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
  if (status) ScoreKeeper(status);
  P1.Update({ paddle: INPUTS.pad1, ball: BALL, autotrack: 0.01 });
  P2.Update({ paddle: INPUTS.pad2, ball: BALL, autotrack: 0.1 });
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
function ScoreKeeper(status) {
  switch (status) {
    case 'WIN P1':
      Score('P1');
      Start(1);
      break;
    case 'WIN P2':
      Score('P2');
      Start(-1);
      break;
    default:
      if (status) console.log(status);
  }
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Score(player) {
  switch (player) {
    case 'P1':
    case 'P2':
      if (SCORES[player] < END_SCORE) {
        SCORES[player]++;
        console.log(`POINT ${player}`, SCORES);
      }
      break;
    default:
      throw Error(`Unknown player '${player}'`);
  }
  // check for clear score end of game
  let winner;
  Object.entries(SCORES).forEach(([key, val]) => {
    if (val >= END_SCORE) winner = key;
  });
  if (winner) {
    console.log(`WINNER ${winner}`, SCORES);
    Init();
    Start();
  }
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function EraseScore() {
  SCORES = { P1: 0, P2: 0 };
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
