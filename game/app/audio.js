const ALERT = require('./log');
let audioCtx;
let oscillator;
let m_timer;

window.onload = function() {
  audioCtx = new AudioContext();
  audioCtx.suspend();
};

function PlayOscillator(hz, duration) {
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(hz, audioCtx.currentTime); // value in hertz
  oscillator.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

function ClickToEnable(element) {
  function handle() {
    audioCtx.resume().then(() => {
      ALERT.Clear();
      ALERT.PrLn('AUDIO ENABLED');
      ALERT.PrHead('GAME ON!');
      element.removeEventListener('click', handle);
      m_timer = setTimeout(() => {
        ALERT.Hide();
        clearTimeout(m_timer);
        m_timer = null;
        element.style.cursor = 'none';
      }, 5000);
    });
  }
  element.addEventListener('click', handle);
}

function Paddle() {
  PlayOscillator(459, 0.0196);
}

function Point() {
  PlayOscillator(290, 0.257);
}

function Bounce() {
  PlayOscillator(226, 0.016);
}

module.exports = {
  ClickToEnable,
  Point,
  Paddle,
  Bounce
};
