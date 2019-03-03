const { WIDTH, HEIGHT } = require('./constants');

let div_out;
let line;
let cleaner = document.createElement('div');

function Pr(line) {
  if (!div_out) {
    div_out = document.getElementById('alert');
    if (!div_out) {
      console.log(`INVALID DOM FALLBACK OUTPUT: ${line}`);
      return;
    } else div_out.textContent = '';
  }
  div_out.innerHTML += line;
  cleaner.innerHTML = line;
  console.log(cleaner.textContent);
}

function PrHead(line) {
  Pr(`<span style='font-size:36px;color:#00FF00'>${line}</span><br/>`);
}
function PrWarn(line) {
  Pr(`<span style='color:#e0a000'>${line}</span><br/>`);
}
function PrLn(line) {
  Pr(`${line}<br/>`);
}

function Clear() {
  div_out.innerHTML = '';
}
function Show() {
  div_out.style.display = 'block';
}
function Hide() {
  div_out.style.display = 'none';
}

module.exports = { Pr, PrLn, PrHead, PrWarn, Clear, Show, Hide };
