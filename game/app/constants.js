// display tuning
const HD_WIDTH = 1280; // native projector width in pixels
const HD_HEIGHT = 720; // native projector height in pixels 
const ASPECT = 36 / 24; // aspect ratio (usuallyl 4/3 or 16/9)
let WIDTH = HD_WIDTH;
let HEIGHT = HD_WIDTH / ASPECT;
if (HEIGHT > HD_HEIGHT) {
  const shrink = HD_HEIGHT / HEIGHT;
  HEIGHT = HD_HEIGHT;
  WIDTH = Math.floor(WIDTH * shrink);
}
// gameplay tuning
const PADDLE_UNITS = 7; // height of paddle in BALL units
const SCORE_MAX = 10; // maximum score
const X_SPEED = 0.5; // ball speed multiplier (do not exceed 2.5)
const X_SCORE = 0.5; // score height multiplier
const X_GAP = 1.5; // the "hole" at top/bottom in ball units
const BALL_COLOR = '#00FF00';
const PADDLE_COLOR = '#00FF00';
const FIELD_COLOR = '#002000';

// other constants
let CONSTANTS = {
  PI: Math.PI,
  WIDTH,
  HEIGHT,
  PADDLE_UNITS,
  SCORE_MAX,
  NET_WIDTH: 4,
  BALL_SPEED: null, // calculated below
  MATRIX_W: 4, // 4 segments size (0-3)
  MATRIX_H: 8, // 8 segments tall (0-7)
  BALL_SIZE: null, // calculated below
  SCORE_SIZE: null, // calculated below
  KEY_UP: 38,
  KEY_DOWN: 40,
  BALL_COLOR,
  PADDLE_COLOR,
  FIELD_COLOR,
  PADDLE_HOLE: X_GAP, // "unreachable" paddle area (multiple of ball size)
  PADDLE_INPUT_MIN: 0, // minimum DEVICE units to clamp input
  PADDLE_INPUT_MAX: 29000 // maximum DEVICE units to clamp input
};

// relative constants based on screen size and ball size
CONSTANTS.BALL_SPEED = Math.floor((CONSTANTS.WIDTH / 100) * X_SPEED);
CONSTANTS.BALL_SIZE = Math.floor(CONSTANTS.HEIGHT / 60);
CONSTANTS.NET_WIDTH = Math.floor(CONSTANTS.WIDTH / 200);
CONSTANTS.SCORE_SIZE = Math.floor(CONSTANTS.BALL_SIZE * X_SCORE);

// screen-relative positionin of scores
const half = Math.floor(CONSTANTS.WIDTH / 2);
const quarter = Math.floor(half / 2);
const halfdigit = Math.floor((CONSTANTS.MATRIX_W * CONSTANTS.SCORE_SIZE) / 2);
CONSTANTS.SCORE_X1 = quarter - halfdigit;
CONSTANTS.SCORE_X2 = half + quarter - halfdigit;
CONSTANTS.SCORE_Y = CONSTANTS.BALL_SIZE * 2;

// export constants
module.exports = CONSTANTS;
