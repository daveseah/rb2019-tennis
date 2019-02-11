let CONSTANTS = {
  WIDTH: 800,
  HEIGHT: 600,
  PI: Math.PI,
  KEY_UP: 38,
  KEY_DOWN: 40,
  BALL_SIZE: 20,
  BALL_SPEED: 12,
  END_SCORE: 5,
  NET_WIDTH: 4
};

// calculate sizes relative to screen width
CONSTANTS.BALL_SIZE = Math.floor(CONSTANTS.WIDTH / 40);
CONSTANTS.BALL_SPEED = Math.floor(CONSTANTS.WIDTH / 80);
CONSTANTS.NET_WIDTH = Math.floor(CONSTANTS.WIDTH / 200);

module.exports = CONSTANTS;
