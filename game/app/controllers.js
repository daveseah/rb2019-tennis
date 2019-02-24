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
  constructor(options) {
    let { side } = options;
    this.width = BALL_SIZE;
    this.height = BALL_SIZE * PADDLE_UNITS;
    this.side = side;
    this.y = (HEIGHT - this.height) / 2;
    if (this.side === 0) throw Error('must pick side');
    if (this.side < 0) this.x = Math.abs(this.side) * BALL_SIZE;
    if (this.side > 0) this.x = WIDTH - Math.abs(this.side * 2) * BALL_SIZE;
  }
  Update(state) {
    const { keystate, pad0, pad1 } = state;
    // keystate is an array indexed by charcode
    // pad0 is player 1 (left)
    // pad1 is player 2 (right)
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
  }
  //
  Update(state) {
    const { keystate, paddle, ball, autotrack = 0.1, twitch = 0 } = state;
    if (keystate) {
      if (keystate[KEY_UP]) this.y -= 7;
      if (keystate[KEY_DOWN]) this.y += 7;
    } else if (paddle !== undefined && paddle !== null) {
      this.y = Math.max(Math.min(paddle, HEIGHT - this.height), 0);
    } else if (ball) {
      const gap1 = PADDLE_HOLE * BALL_SIZE;
      const gap2 = HEIGHT - this.height - gap1;
      let desty = ball.y - (this.height - BALL_SIZE) * 0.5 + twitch;
      if (desty < gap1) desty = gap1;
      if (desty > gap2) desty = gap2;
      this.y += (desty - this.y) * autotrack;
      this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
    }
  }
}

/// MODULE
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = { Paddle, Player };
