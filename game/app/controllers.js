const { HEIGHT, KEY_UP, KEY_DOWN } = require('./constants');
const STATE = require('./gamestate');

class Paddle {
  constructor() {
    this.width = 20;
    this.height = 100;
    this.x = null;
    this.y = (HEIGHT - this.height) / 2;
    this.type = 'paddle';
  }
  Update(state) {
    const { keystate, pad0, pad1 } = state;
    // override
  }
  Draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // console.log(this.x, this.y, this.width, this.height);
  }
  Set(props) {
    this.x = props.x;
  }
}

class Player extends Paddle {
  constructor() {
    super();
    this.x = this.width;
    this.type = 'human';
  }
  Update(state) {
    const { keystate, pad0, pad1 } = state;
    if (keystate[KEY_UP]) this.y -= 7;
    if (keystate[KEY_DOWN]) this.y += 7;
    if (pad0 !== null) this.y = pad0;
  }
}

class AIPlayer extends Paddle {
  constructor() {
    super();
    this.x = this.width;
    this.type = 'ai';
  }
  Update(state) {
    let { bally, ballside } = state;
    let desty = bally - (this.height - ballside) * 0.5;
    this.y += (desty - this.y) * 0.1;
    this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
  }
}

module.exports = { Paddle, Player, AIPlayer };
