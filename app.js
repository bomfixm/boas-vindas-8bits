// A cena é desenhada em tempo real a partir de assets/cena/dados.js (gerado pela pasta pixel-art).
// Cada trilha é uma lista de desenhos com início em ms e posição no palco; o tempo decorrido escolhe o desenho.
const data = window.SCENE;
const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d', { alpha: false });
const screenBox = document.querySelector('.screen');
const player = document.querySelector('#player');
const playButton = document.querySelector('#play');
const playText = document.querySelector('#play-text');
const playIcon = document.querySelector('#play-icon');
const overlay = document.querySelector('#start-overlay');
const seek = document.querySelector('#seek');
const clock = document.querySelector('#time');
const repeat = document.querySelector('#repeat');
const fullscreenButton = document.querySelector('#fullscreen');
const fullscreenText = document.querySelector('#fullscreen-text');
const status = document.querySelector('#screen-status');
const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
const W = data.width;
const H = data.height;
const duration = data.duration;
const stageImage = new Image();
const spriteImage = new Image();
const scene = { time: 0, playing: false, ended: false, base: 0, ready: false };
let lastFrame = '';
let lastClock = '';
let idleTimer;
let noticeTimer;
let wakeLock = null;

const formatTime = ms => `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
chapterButtons.forEach(button => { button.dataset.time = data.chapters[button.dataset.chapter]; });

// último desenho que começou até o tempo t (-1 antes do primeiro)
function itemAt(starts, t) {
  if (t < starts[0]) return -1;
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (starts[middle] <= t) low = middle;
    else high = middle - 1;
  }
  return low;
}

// redesenha só quando algum desenho muda (os desenhos duram de 40 a 150 ms)
function draw(t, force = false) {
  if (!scene.ready) return;
  const items = data.tracks.map(track => itemAt(track.t, t));
  const key = items.join();
  if (key === lastFrame && !force) return;
  lastFrame = key;
  ctx.drawImage(stageImage, 0, 0);
  ctx.fillStyle = data.cableColor;
  data.tracks.forEach((track, i) => {
    const width = track.cable && items[i] >= 0 ? Math.min(W, track.cable[items[i]] + 1) : 0;
    if (width > 0) ctx.fillRect(0, data.floor, width, 1);   // o fio da cantora fica no chão, por baixo de todos
  });
  data.tracks.forEach((track, i) => {
    const k = items[i];
    if (k < 0 || track.s[k] < 0) return;
    const [sx, sy, w, h] = data.atlas[track.s[k]];
    ctx.drawImage(spriteImage, sx, sy, w, h, track.x[k], track.y[k], w, h);
  });
}

// pixels sempre quadrados: escala inteira quando ela ocupa pelo menos 90% da tela, senão preenche
function fitCanvas() {
  const box = screenBox.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const fit = Math.min(box.width * ratio / W, box.height * ratio / H);
  const whole = Math.floor(fit);
  const scale = whole >= 1 && whole / fit >= 0.9 ? whole : fit;
  canvas.style.width = `${W * scale / ratio}px`;
  canvas.style.height = `${H * scale / ratio}px`;
}

function updateTime() {
  seek.value = scene.time / 1000;
  const text = `${formatTime(scene.time)} / ${formatTime(duration)}`;
  if (text === lastClock) return;
  lastClock = text;
  clock.textContent = text;
  seek.setAttribute('aria-valuetext', `${Math.round(scene.time / 1000)} de ${Math.round(duration / 1000)} segundos`);
  const current = chapterButtons.findLastIndex(button => scene.time >= Number(button.dataset.time));
  chapterButtons.forEach((button, index) => {
    if (index === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

function updatePlayback() {
  const playing = scene.playing;
  playText.textContent = playing ? 'Pausar' : 'Reproduzir';
  playIcon.textContent = playing ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', playing ? 'Pausar animação' : 'Reproduzir animação');
  overlay.hidden = playing || scene.time > 0;
  if (!playing) player.classList.remove('idle');
  else showControls();
  keepScreenOn(playing);
}

function notice(text) {
  clearTimeout(noticeTimer);
  status.textContent = text;
  noticeTimer = setTimeout(() => { status.textContent = ''; }, 1600);
}

function tick(now) {
  if (!scene.playing) return;
  let t = Math.max(0, now - scene.base);
  if (t >= duration) {
    if (repeat.checked) { t %= duration; scene.base = now - t; }
    else { t = duration - 1; scene.playing = false; scene.ended = true; }
  }
  scene.time = t;
  draw(Math.floor(t));
  updateTime();
  if (scene.playing) requestAnimationFrame(tick);
  else updatePlayback();
}

function play() {
  if (!scene.ready || scene.playing) return;
  if (scene.ended) { scene.time = 0; scene.ended = false; }
  scene.playing = true;
  scene.base = performance.now() - scene.time;
  updatePlayback();
  requestAnimationFrame(tick);
}

function pause() {
  if (!scene.playing) return;
  scene.playing = false;
  updatePlayback();
}

function togglePlayback() { scene.playing ? pause() : play(); }

function seekTo(ms) {
  scene.time = Math.min(duration - 1, Math.max(0, Math.round(ms)));
  scene.ended = false;
  if (scene.playing) scene.base = performance.now() - scene.time;
  draw(scene.time);
  updateTime();
  updatePlayback();
}

function restart() { seekTo(0); play(); }

function showControls() {
  player.classList.remove('idle');
  clearTimeout(idleTimer);
  if (scene.playing) idleTimer = setTimeout(() => player.classList.add('idle'), 2800);
}

// mantém a tela da TV ou do projetor acesa enquanto a cena roda, quando o navegador permite
async function keepScreenOn(on) {
  try {
    if (on && !wakeLock && navigator.wakeLock && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) await wakeLock.release();
  } catch { wakeLock = null; }
}

function setFullscreen(active) {
  player.classList.toggle('telao', active);
  fullscreenText.textContent = active ? 'Sair do telão' : 'Modo telão';
  fullscreenButton.setAttribute('aria-label', active ? 'Sair do modo telão' : 'Ativar modo telão');
  fitCanvas();
  showControls();
}

// o telão ocupa a janela na hora; a tela cheia entra por cima quando o navegador deixa (no iPhone, não deixa)
async function toggleFullscreen() {
  if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
  if (player.classList.contains('telao')) { setFullscreen(false); return; }
  setFullscreen(true);
  try { if (player.requestFullscreen) await player.requestFullscreen(); } catch { /* fica no telão da janela */ }
}

playButton.addEventListener('click', togglePlayback);
overlay.addEventListener('click', play);
canvas.addEventListener('click', togglePlayback);
document.querySelector('#restart').addEventListener('click', restart);
seek.addEventListener('input', () => { seekTo(Number(seek.value) * 1000); showControls(); });
fullscreenButton.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => setFullscreen(document.fullscreenElement === player));
document.addEventListener('visibilitychange', () => keepScreenOn(scene.playing));
new ResizeObserver(fitCanvas).observe(screenBox);
window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`).addEventListener('change', fitCanvas);

chapterButtons.forEach(button => button.addEventListener('click', () => {
  seekTo(Number(button.dataset.time));
  play();
}));

player.addEventListener('pointermove', showControls);
player.addEventListener('pointerdown', showControls);
player.addEventListener('focusin', showControls);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && player.classList.contains('telao') && !document.fullscreenElement) { setFullscreen(false); return; }
  if (event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|BUTTON|A|SELECT|TEXTAREA)$/.test(event.target.tagName)) return;
  if (event.code === 'Space') { event.preventDefault(); togglePlayback(); }
  else if (event.key.toLowerCase() === 'r') restart();
  else if (event.key.toLowerCase() === 'f') toggleFullscreen();
  else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    seekTo(scene.time + (event.key === 'ArrowRight' ? 5000 : -5000));
  }
});

function loaded(image, src) {
  return new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
}

fitCanvas();
updateTime();
updatePlayback();
Promise.all([loaded(stageImage, data.stage), loaded(spriteImage, data.sprites)]).then(() => {
  scene.ready = true;
  ctx.imageSmoothingEnabled = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) draw(duration - 1);   // sem movimento: mostra a banda toda, parada
  else { draw(0); play(); }
}).catch(() => {
  document.querySelector('#scene-error').hidden = false;
  overlay.hidden = true;
  playButton.disabled = true;
});
