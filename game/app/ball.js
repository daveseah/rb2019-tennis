const { WIDTH, HEIGHT, PI } = require('./constants');

// helper function to check intesectiont between two
// axis aligned bounding boxex (AABB)
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
}

/// CLASS: Ball ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Ball {
  constructor() {
    this.size = 20;
    this.x = null;
    this.y = null;
    this.vel = null;
    this.speed = 12;
  }
  Serve(side) {
    if (typeof side !== 'number') throw Error('arg1 should be 1 or -1');
    // set the x and y position
    var r = Math.random();
    this.x = side === 1 ? this.size : WIDTH - this.size;
    this.y = (HEIGHT - this.size) * r;
    // calculate out-angle, higher/lower on the y-axis =>
    // steeper angle
    var phi = 0.1 * PI * (1 - 2 * r);
    // set velocity direction and magnitude
    this.vel = {
      x: side * this.speed * Math.cos(phi),
      y: this.speed * Math.sin(phi)
    };
  }
  Update(state) {
    let { P1, P2 } = state;
    // update position with current velocity
    this.x += this.vel.x;
    this.y += this.vel.y;
    // check if out of the canvas in the y direction
    if (0 > this.y || this.y + this.size > HEIGHT) {
      // calculate and add the right offset, i.e. how far
      // inside of the canvas the BALL is
      var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.size);
      this.y += 2 * offset;
      // mirror the y velocity
      this.vel.y *= -1;
    }
    // check againts target paddle to check collision in x
    // direction
    var pdle = this.vel.x < 0 ? P1 : P2;
    if (
      AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height, this.x, this.y, this.size, this.size)
    ) {
      // set the x position and calculate reflection angle
      this.x = pdle === P1 ? P1.x + P1.width : P2.x - this.size;
      var n = (this.y + this.size - pdle.y) / (pdle.height + this.size);
      var phi = 0.25 * PI * (2 * n - 1); // PI/4 = 45
      // calculate smash value and update velocity
      var smash = Math.abs(phi) > 0.2 * PI ? 1.5 : 1;
      this.vel.x = smash * (pdle === P1 ? 1 : -1) * this.speed * Math.cos(phi);
      this.vel.y = smash * this.speed * Math.sin(phi);
    }
    // reset the BALL when BALL outside of the canvas in the
    // x direction
    if (0 > this.x + this.size || this.x > WIDTH) {
      this.Serve(pdle === P1 ? 1 : -1);
    }
  }
  Draw(ctx) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

module.exports = { Ball };
