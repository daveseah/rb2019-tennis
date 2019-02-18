const DBG = false;

/// CONSTANTS ////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const { SCORE_X1, SCORE_X2, SCORE_Y, SCORE_SIZE, SCORE_MAX } = require('./constants');

/// CLASS: Scoreboard /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Scoreboard {
  constructor() {
    this.Reset();
  }
  Reset() {
    this.scoreP1 = 0;
    this.scoreP2 = 0;
    this.winner = 0;
  }
  //
  Score(player) {
    switch (player) {
      case 1:
        this.scoreP1 = ++this.scoreP1;
        if (DBG) console.log('point: player 1');
        if (this.scoreP1 === SCORE_MAX) {
          this.winner = 1;
          if (DBG) console.log('winner: player 1');
        }
        break;
      case 2:
        this.scoreP2 = ++this.scoreP2;
        if (DBG) console.log('point: player 2');
        if (this.scoreP2 === SCORE_MAX) {
          if (DBG) console.log('winner: player 2');
          this.winner = 2;
        }
        break;
      default:
        if (DBG) console.log('bad Score() input', player);
    }
  }
  //
  Update(state) {}
  //
  Won() {
    return this.winner;
  }
  //
  Draw(ctx) {
    this.DrawDigit(ctx, SCORE_X1, SCORE_Y, this.scoreP1);
    this.DrawDigit(ctx, SCORE_X2, SCORE_Y, this.scoreP2);
  }
  // draw digit on ctx at x,y
  DrawDigit(ctx, x, y, digit) {
    let blk = SCORE_SIZE;

    // mseg helper draws "matrix segments"
    function mseg(sx, sy, sw, sh) {
      // these are mseg sizes "matrix segments"
      const xx = sx * blk;
      const yy = sy * blk;
      const ww = sw * blk;
      const hh = sh * blk;
      // draw at x,y offset
      ctx.fillRect(x + xx, y + yy, ww, hh);
    }

    switch (digit) {
      case 0:
        mseg(0, 0, 4, 1); // top
        mseg(0, 7, 4, 1); // bot
        mseg(0, 0, 1, 8); // left
        mseg(3, 0, 1, 8); // right
        break;
      case 1:
        mseg(3, 0, 1, 8); // right
        break;
      case 2:
        mseg(0, 0, 4, 1); // top
        mseg(0, 3, 4, 1); // mid
        mseg(0, 7, 4, 1); // bot
        mseg(3, 1, 1, 2); // right
        mseg(0, 4, 1, 3); // left
        break;
      case 3:
        mseg(0, 0, 4, 1); // top
        mseg(0, 3, 4, 1); // mid
        mseg(0, 7, 4, 1); // bot
        mseg(3, 0, 1, 8); // right
        break;
      case 4:
        mseg(0, 3, 4, 1); // mid
        mseg(0, 0, 1, 3); // left
        mseg(3, 0, 1, 7); // right
        break;
      case 5:
        mseg(0, 0, 4, 1); // top
        mseg(0, 3, 4, 1); // mid
        mseg(0, 7, 4, 1); // bot
        mseg(0, 1, 1, 2); // left
        mseg(3, 4, 1, 3); // right
        break;
      case 6:
        mseg(0, 3, 4, 1); // mid
        mseg(0, 7, 4, 1); // bot
        mseg(0, 0, 1, 8); // left
        mseg(3, 4, 1, 3); // right
        break;
      case 7:
        mseg(0, 0, 4, 1); // top
        mseg(3, 0, 1, 8); // right
        break;
      case 8:
        mseg(0, 0, 4, 1); // top
        mseg(0, 3, 4, 1); // mid
        mseg(0, 7, 4, 1); // bot
        mseg(0, 0, 1, 8); // left
        mseg(3, 0, 1, 8); // right
        break;
      case 9:
        mseg(0, 0, 4, 1); // top
        mseg(0, 3, 4, 1); // mid
        mseg(0, 0, 1, 3); // left
        mseg(3, 0, 1, 8); // right
        break;
      default:
        mseg(0, 0, 4, 8); // error
    }
  }
}

module.exports = { Scoreboard };
