let CONSTANTS = {
  WIDTH: 800,
  HEIGHT: 600,
  PI: Math.PI,
  KEY_UP: 38,
  KEY_DOWN: 40,
  BALL_SIZE: null,
  BALL_SPEED: 12,
  MATRIX_W: 4, // 4 segments size (0-3)
  MATRIX_H: 8, // 8 segments tall (0-7)
  SCORE_MAX: 5,
  NET_WIDTH: 4,
  SCORE_SIZE: null
};

// calculate sizes relative to screen width
CONSTANTS.BALL_SIZE = Math.floor(CONSTANTS.WIDTH / 40);
CONSTANTS.BALL_SPEED = Math.floor(CONSTANTS.WIDTH / 80);
CONSTANTS.NET_WIDTH = Math.floor(CONSTANTS.WIDTH / 200);
CONSTANTS.SCORE_SIZE = Math.floor(CONSTANTS.BALL_SIZE / 2);

const half = Math.floor(CONSTANTS.WIDTH / 2);
const quarter = Math.floor(half / 2);
const halfdigit = Math.floor((CONSTANTS.MATRIX_W * CONSTANTS.SCORE_SIZE) / 2);
CONSTANTS.SCORE_X1 = quarter - halfdigit;
CONSTANTS.SCORE_X2 = half + quarter - halfdigit;
CONSTANTS.SCORE_Y = CONSTANTS.BALL_SIZE * 2;

module.exports = CONSTANTS;
