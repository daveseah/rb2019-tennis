const WIDTH = 1000;
const ASPECT = 4 / 3;
const PADDLE_UNITS = 7;
const SCORE_MAX = 9;
const SCORE_SIZE = 1;

// other constants
let CONSTANTS = {
  PI: Math.PI,
  WIDTH,
  HEIGHT: WIDTH / ASPECT, // 4:3 TV ASPECT,
  PADDLE_UNITS,
  SCORE_MAX,
  NET_WIDTH: 4,
  BALL_SPEED: 12,
  MATRIX_W: 4, // 4 segments size (0-3)
  MATRIX_H: 8, // 8 segments tall (0-7)
  BALL_SIZE: null,
  SCORE_SIZE: null,
  KEY_UP: 38,
  KEY_DOWN: 40
};

// relative constants based on screen size and ball size
CONSTANTS.BALL_SIZE = Math.floor(CONSTANTS.HEIGHT / 60);
CONSTANTS.BALL_SPEED = Math.floor(CONSTANTS.WIDTH / 80);
CONSTANTS.NET_WIDTH = Math.floor(CONSTANTS.WIDTH / 200);
CONSTANTS.SCORE_SIZE = Math.floor(CONSTANTS.BALL_SIZE * SCORE_SIZE);

// screen-relative positionin of scores
const half = Math.floor(CONSTANTS.WIDTH / 2);
const quarter = Math.floor(half / 2);
const halfdigit = Math.floor((CONSTANTS.MATRIX_W * CONSTANTS.SCORE_SIZE) / 2);
CONSTANTS.SCORE_X1 = quarter - halfdigit;
CONSTANTS.SCORE_X2 = half + quarter - halfdigit;
CONSTANTS.SCORE_Y = CONSTANTS.BALL_SIZE * 2;

// export constants
module.exports = CONSTANTS;
