const DBG = false;

/// CONSTANTS ////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const { WIDTH, HEIGHT, NET_WIDTH, BALL_SIZE } = require('./constants');
const BALL_SIZE_2 = BALL_SIZE * 2;
const NET_X = (WIDTH - NET_WIDTH) * 0.5;
const NET_STEP = HEIGHT / 20;
const YGAP = NET_STEP * 0.25;
const YDASH = NET_STEP * 0.5;

/// CLASS: Scoreboard /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class Net {
    constructor() {
        this.Reset();
    }
    Reset() {
        this.framecounter = 0;
    }
    //
    Update(state) { }
    //
    Draw(ctx, ball) {
        this.framecounter++;
        // first draw
        if (this.framecounter === 1) {
            for (let y = 0; y < HEIGHT; y += NET_STEP) {
                ctx.fillRect(NET_X, y + YGAP, NET_WIDTH, YDASH);
            }
            return;
        }
        // checked draw
        if ((ball.x > NET_X - BALL_SIZE_2) && (ball.x < NET_X + NET_WIDTH + BALL_SIZE_2)) {
            if (DBG) console.log("net redraw");
            const BY = ball.y;
            for (let y = 0; y < HEIGHT; y += NET_STEP) {
                if ((BY > y - BALL_SIZE) && (BY < y + BALL_SIZE_2))
                    ctx.fillRect(NET_X, y + YGAP, NET_WIDTH, YDASH);
            }
        }
    }
}
module.exports = { Net };
