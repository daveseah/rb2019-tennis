const { HEIGHT, KEY_UP, KEY_DOWN, BALL_SIZE } = require('./constants');
const STATE = require('./gamestate');

/// CLASS: Paddle /////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Paddle {
  constructor() {
    this.width = 20;
    this.height = 100;
    this.x = 0;
    this.y = (HEIGHT - this.height) / 2;
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
  Set(props) {
    this.x = props.x;
  }
}

/// CLASS: HUMAN PLAYER ///////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Player extends Paddle {
  constructor(side = 0) {
    super();
    this.side = side;
  }
  Update(state) {
    const { keystate, paddle } = state;
    if (keystate) {
      if (keystate[KEY_UP]) this.y -= 7;
      if (keystate[KEY_DOWN]) this.y += 7;
    }
    if (paddle && paddle !== null) this.y = paddle;
  }
}

/// CLASS: AI PLAYER //////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// inherits from Paddle
class AIPlayer extends Paddle {
  constructor() {
    super();
    this.x = this.width;
  }
  Update(state) {
    let { paddle } = state;
    let desty = paddle - (this.height - BALL_SIZE) * 0.5;
    this.y += (desty - this.y) * 0.1;
    this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
  }
}

/// MODULE
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = { Paddle, Player, AIPlayer };
