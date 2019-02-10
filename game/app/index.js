// PONG source based on Max Wihlborg's YouTube tutorial,
// https://www.youtube.com/watch?v=KApAJhkkqkA
// https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html

const WIDTH = 1600;
const HEIGHT = 950;
const pi = Math.PI;
const KEY_UP = 38;
const KEY_DOWN = 40;

let IN_PAD0 = null;

let canvas, ctx, keystate;

let PLAYER = {
  x: null,
  y: null,
  width: 20,
  height: 100
};
PLAYER.Update = function() {
  if (keystate[KEY_UP]) this.y -= 7;
  if (keystate[KEY_DOWN]) this.y += 7;
  if (IN_PAD0 !== null) {
    this.y = IN_PAD0;
    IN_PAD0 = null;
  }
};
PLAYER.Draw = function() {
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

let AI = {
  x: null,
  y: null,
  width: 20,
  height: 100
};
AI.Update = function() {
  // calculate ideal position
  var desty = BALL.y - (this.height - BALL.side) * 0.5;
  // ease the movement towards the ideal position
  this.y += (desty - this.y) * 0.1;
  // keep the paddle inside of the canvas
  this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
};
AI.Draw = function() {
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

let BALL = {
  x: null,
  y: null,
  vel: null,
  side: 20,
  speed: 12
};
BALL.Serve = function(side) {
  // set the x and y position
  var r = Math.random();
  this.x = side === 1 ? PLAYER.x + PLAYER.width : AI.x - this.side;
  this.y = (HEIGHT - this.side) * r;
  // calculate out-angle, higher/lower on the y-axis =>
  // steeper angle
  var phi = 0.1 * pi * (1 - 2 * r);
  // set velocity direction and magnitude
  this.vel = {
    x: side * this.speed * Math.cos(phi),
    y: this.speed * Math.sin(phi)
  };
};
BALL.Update = function() {
  // update position with current velocity
  this.x += this.vel.x;
  this.y += this.vel.y;
  // check if out of the canvas in the y direction
  if (0 > this.y || this.y + this.side > HEIGHT) {
    // calculate and add the right offset, i.e. how far
    // inside of the canvas the BALL is
    var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.side);
    this.y += 2 * offset;
    // mirror the y velocity
    this.vel.y *= -1;
  }
  // helper function to check intesectiont between two
  // axis aligned bounding boxex (AABB)
  var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
  };
  // check againts target paddle to check collision in x
  // direction
  var pdle = this.vel.x < 0 ? PLAYER : AI;
  if (
    AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height, this.x, this.y, this.side, this.side)
  ) {
    // set the x position and calculate reflection angle
    this.x = pdle === PLAYER ? PLAYER.x + PLAYER.width : AI.x - this.side;
    var n = (this.y + this.side - pdle.y) / (pdle.height + this.side);
    var phi = 0.25 * pi * (2 * n - 1); // pi/4 = 45
    // calculate smash value and update velocity
    var smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;
    this.vel.x = smash * (pdle === PLAYER ? 1 : -1) * this.speed * Math.cos(phi);
    this.vel.y = smash * this.speed * Math.sin(phi);
  }
  // reset the BALL when BALL outside of the canvas in the
  // x direction
  if (0 > this.x + this.side || this.x > WIDTH) {
    this.Serve(pdle === PLAYER ? 1 : -1);
  }
};
BALL.Draw = function() {
  ctx.fillRect(this.x, this.y, this.side, this.side);
};

/**
 * Starts the game
 */
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
  PLAYER.x = PLAYER.width;
  PLAYER.y = (HEIGHT - PLAYER.height) / 2;
  AI.x = WIDTH - (PLAYER.width + AI.width);
  AI.y = (HEIGHT - AI.height) / 2;
  BALL.Serve(1);
}
/**
 * Update all game objects
 */
function update() {
  BALL.Update();
  PLAYER.Update();
  AI.Update();
}
/**
 * Clear canvas and draw all game objects and net
 */
function draw() {
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.fillStyle = '#fff';
  BALL.Draw();
  PLAYER.Draw();
  AI.Draw();
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
  connection.send('REQUEST from BROWSER');
};

connection.onerror = error => {
  console.log(`WebSocket error:`, error);
};

connection.onmessage = e => {
  IN_PAD0 = parseInt(e.data, 10);
};
