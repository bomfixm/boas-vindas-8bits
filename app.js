const video = document.querySelector('#video');
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
const chapterButtons = [...document.querySelectorAll('[data-time]')];
let idleTimer;
let noticeTimer;

const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function updateTime() {
  const duration = Number.isFinite(video.duration) ? video.duration : 32;
  seek.max = duration;
  seek.value = video.currentTime;
  seek.setAttribute('aria-valuetext', `${Math.round(video.currentTime)} de ${Math.round(duration)} segundos`);
  clock.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
  const current = chapterButtons.findLastIndex(button => video.currentTime >= Number(button.dataset.time));
  chapterButtons.forEach((button, index) => {
    if (index === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

function updatePlayback() {
  const playing = !video.paused && !video.ended;
  playText.textContent = playing ? 'Pausar' : 'Reproduzir';
  playIcon.textContent = playing ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', playing ? 'Pausar animação' : 'Reproduzir animação');
  overlay.hidden = playing || video.currentTime > 0;
  if (!playing) player.classList.remove('idle');
  else showControls();
}

function notice(text) {
  clearTimeout(noticeTimer);
  status.textContent = text;
  noticeTimer = setTimeout(() => { status.textContent = ''; }, 1600);
}

async function play() {
  if (video.ended) video.currentTime = 0;
  try { await video.play(); status.textContent = ''; }
  catch (error) { if (error.name !== 'AbortError') { updatePlayback(); notice('Toque em reproduzir para começar.'); } }
}

function togglePlayback() { video.paused ? play() : video.pause(); }

function showControls() {
  player.classList.remove('idle');
  clearTimeout(idleTimer);
  if (!video.paused) idleTimer = setTimeout(() => player.classList.add('idle'), 2800);
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (player.requestFullscreen) await player.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    else notice('Use a opção de tela cheia do seu navegador.');
    showControls();
  } catch { notice('A tela cheia não está disponível neste navegador.'); }
}

playButton.addEventListener('click', togglePlayback);
overlay.addEventListener('click', play);
video.addEventListener('click', togglePlayback);
document.querySelector('#restart').addEventListener('click', () => { video.currentTime = 0; updateTime(); play(); });
seek.addEventListener('input', () => { video.currentTime = Number(seek.value); updateTime(); showControls(); });
repeat.addEventListener('change', () => { video.loop = repeat.checked; });
fullscreenButton.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  const active = Boolean(document.fullscreenElement);
  fullscreenText.textContent = active ? 'Sair do telão' : 'Modo telão';
  fullscreenButton.setAttribute('aria-label', active ? 'Sair do modo telão' : 'Ativar modo telão');
  showControls();
});

chapterButtons.forEach(button => button.addEventListener('click', () => {
  video.currentTime = Number(button.dataset.time);
  updateTime();
  play();
}));

for (const event of ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked']) video.addEventListener(event, updateTime);
for (const event of ['play', 'pause', 'ended']) video.addEventListener(event, updatePlayback);
video.addEventListener('error', () => {
  document.querySelector('#video-error').hidden = false;
  overlay.hidden = true;
  playButton.disabled = true;
});
player.addEventListener('pointermove', showControls);
player.addEventListener('pointerdown', showControls);
player.addEventListener('focusin', showControls);
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|BUTTON|A|SELECT|TEXTAREA/.test(event.target.tagName)) return;
  if (event.code === 'Space') { event.preventDefault(); togglePlayback(); }
  else if (event.key.toLowerCase() === 'r') { video.currentTime = 0; play(); }
  else if (event.key.toLowerCase() === 'f') toggleFullscreen();
  else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    video.currentTime = Math.min(video.duration || 32, Math.max(0, video.currentTime + (event.key === 'ArrowRight' ? 5 : -5)));
    updateTime();
  }
});
updateTime();
updatePlayback();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play();
