// PONG source based on Max Wihlborg's YouTube tutorial,
// https://www.youtube.com/watch?v=KApAJhkkqkA
// https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

// load controllers and piece classes
const { Player, AIPlayer } = require('./controllers');
const { Ball } = require('./pieces');
const { WIDTH, HEIGHT, PI, KEY_UP, KEY_DOWN } = require('./constants');

// drawing surfaces
let canvas, ctx;

// global input triggers
let keystate;
let pad0 = 0;

// create new players and pieces
let PLAYER = new Player();
let AI = new AIPlayer();
let BALL = new Ball();

// start the game
function main() {
  // create, initiate and append game canvas
  canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  keystate = {};
  // keep track of keyboard presses
  document.addEventListener('keydown', function(evt) {
    keystate[evt.keyCode] = true;
  });
  document.addEventListener('keyup', function(evt) {
    delete keystate[evt.keyCode];
  });
  init(); // initiate game objects
  // game loop function
  var loop = function() {
    update();
    draw();
    window.requestAnimationFrame(loop, canvas);
  };
  window.requestAnimationFrame(loop, canvas);
}
/**
 * Initatite game objects and set start positions
 */
function init() {
  AI.x = WIDTH - (PLAYER.width + AI.width);
  AI.y = (HEIGHT - AI.height) / 2;
  BALL.Serve(1);
}
/**
 * Update all game objects
 */
function update() {
  BALL.Update({ PLAYER, AI });
  PLAYER.Update({ keystate, pad0 });
  AI.Update({ bally: BALL.y, ballsize: BALL.size });
  pad0 = null;
}
/**
 * Clear canvas and draw all game objects and net
 */
function draw() {
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
// start and run the game
main();

// websockets
const url = 'ws://localhost:8080';
const connection = new WebSocket(url);

connection.onopen = () => {
  connection.send('client : open connection');
};

connection.onerror = error => {
  console.log(`WebSocket error:`, error);
};

connection.onmessage = e => {
  // currently no protocol
  // expects an integer
  const msg = e.data;
  let val = parseInt(msg, 10);
  if (!isNaN(val)) pad0 = val;
};

// hot module replacement override
if (module.hot) {
  // warn server that client is reloading
  module.hot.dispose(function() {
    connection.send('client : reloaded page');
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
