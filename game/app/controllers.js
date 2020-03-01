const {
  PADDLE_UNITS,
  WIDTH,
  HEIGHT,
  KEY_UP,
  KEY_DOWN,
  BALL_SIZE,
  PADDLE_HOLE,
  PADDLE_COLOR,
  BALL_COLOR
} = require('./constants');

/// CLASS: Paddle /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Paddle {
  constructor(options, ball) {
    let { side } = options;
    this.width = BALL_SIZE;
    this.height = BALL_SIZE * PADDLE_UNITS;
    this.side = side;
    this.y = (HEIGHT - this.height) / 2;
    this.ball = ball;
    this.oldY = 0;
    if (this.side === 0) throw Error('must pick side');
    if (this.side < 0) this.x = Math.abs(this.side) * BALL_SIZE;
    if (this.side > 0) this.x = WIDTH - Math.abs(this.side * 2) * BALL_SIZE;
  }
  Update(state) {
    const { keystate, pad0, pad1 } = state;
    this.oldY = this.y;
    // keystate is an array indexed by charcode
    // pad0 is player 1 (left)
    // pad1 is player 2 (right)
  }
  Clear(ctx) {
    ctx.fillRect(this.x, this.oldY - BALL_SIZE, this.width, this.height + BALL_SIZE + BALL_SIZE);
  }
  Draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/// CLASS: HUMAN PLAYER ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Player extends Paddle {
  constructor(side) {
    super(side);
    this.controlled = 0;
  }
  //
  Update(state) {
    super.Update(state);
    if (this.controlled > 0) this.controlled--;

    const { keystate, paddle, ball, autotrack = 0, twitch = 0 } = state;
    // autotracking
    if (this.controlled === 0) {
      const gap1 = PADDLE_HOLE * BALL_SIZE;
      const gap2 = HEIGHT - this.height - gap1;
      let desty = ball.y - (this.height - BALL_SIZE) * 0.5 + twitch;
      if (desty < gap1) desty = gap1;
      if (desty > gap2) desty = gap2;
      this.y += (desty - this.y) * autotrack;
      this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
    } else if (paddle) {
      this.y = Math.max(Math.min(paddle, HEIGHT - this.height), 0);
    }
  }
  //
  Deactivate() {
    this.controlled = 0;
  }
  //
  Activate() {
    this.controlled = 1000;
  }
}

/// MODULE
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = { Paddle, Player };
