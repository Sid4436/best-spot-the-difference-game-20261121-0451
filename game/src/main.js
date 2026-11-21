// main.js — mesin permainan "Sore di Taman Desa".
// State: start | play | roundClear | win | lose. HUD di DOM, scene di canvas.
// Query param ?shot=start|play|end&seed=1 merender state deterministik
// untuk screenshot: start = layar judul, play = tengah ronde 1 dengan
// 3 perbedaan sudah ditemukan, end = layar menang.
import { PANEL_W, PANEL_H, PANEL_GAP, CANVAS_W, CANVAS_H, ROUNDS, HINT_COOLDOWN_MS, HINT_SHOW_MS, POINTS_PER_FIND, TIME_BONUS_PER_SECOND, WRONG_CLICK_PENALTY_S } from './config.js';
import { diffsForRound, pickDiffAt } from './differences.js';
import { drawPanels, dimCanvas } from './render.js';
import { mapClickToPanel, bindKeyboard } from './input.js';
import { playFound, playWrong, playHint, playWin, playLose, playClick, unlockAudio } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const el = (id) => document.getElementById(id);
const hudRound = el('hud-round');
const hudFound = el('hud-found');
const hudRemain = el('hud-remain');
const hudTimer = el('hud-timer');
const hudScore = el('hud-score');
const hudHints = el('hud-hints');
const toast = el('toast');
const overlay = el('overlay');
const overlayTitle = el('overlay-title');
const overlayText = el('overlay-text');
const overlayBtn = el('overlay-btn');

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || '1');

const game = {
  state: 'start',
  round: 0,
  found: new Set(),
  foundList: [],
  score: 0,
  timeLeft: ROUNDS[0].timeLimit,
  hintsLeft: ROUNDS[0].hintMax,
  lastHintAt: 0,
  hintDiff: null,
  hintUntil: 0,
  timerId: null,
  toastId: null,
};

function diffs() {
  return diffsForRound(game.round);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(game.toastId);
  game.toastId = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateHud() {
  const total = diffs().length;
  const found = game.found.size;
  hudRound.textContent = `${ROUNDS[game.round].name}  •  Ronde ${game.round + 1}/3`;
  hudFound.textContent = `Ketemu: ${found}/${total}`;
  hudRemain.textContent = `Sisa perbedaan: ${total - found}`;
  hudTimer.textContent = `⏱ ${Math.max(0, Math.ceil(game.timeLeft))} dtk`;
  hudTimer.classList.toggle('danger', game.timeLeft <= 15);
  hudScore.textContent = `Skor: ${game.score}`;
  hudHints.textContent = `Hint (H): ${game.hintsLeft} tersisa`;
}

function render() {
  drawPanels(ctx, game.round, game.foundList, game.hintDiff, game.timeLeft);
  if (game.state === 'start' || game.state === 'win' || game.state === 'lose' || game.state === 'roundClear') {
    dimCanvas(ctx);
  }
}

function showOverlay(title, text, btnLabel) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayBtn.textContent = btnLabel;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function stopTimer() {
  if (game.timerId) clearInterval(game.timerId);
  game.timerId = null;
}

function startRound(roundIndex, preFound = 0) {
  game.round = roundIndex;
  game.found = new Set();
  game.foundList = [];
  game.timeLeft = ROUNDS[roundIndex].timeLimit;
  game.hintsLeft = ROUNDS[roundIndex].hintMax;
  game.hintDiff = null;
  game.state = 'play';
  hideOverlay();
  // Mode screenshot: tandai beberapa perbedaan sebagai sudah ditemukan.
  for (let i = 0; i < preFound; i++) {
    const d = diffs()[i];
    game.found.add(d.id);
    game.foundList.push(d);
  }
  updateHud();
  render();
  stopTimer();
  game.timerId = setInterval(() => {
    if (game.state !== 'play') return;
    game.timeLeft -= 1;
    if (game.hintDiff && Date.now() > game.hintUntil) game.hintDiff = null;
    if (game.timeLeft <= 0) return loseGame();
    updateHud();
    render();
  }, 1000);
}

function useHint() {
  if (game.state !== 'play') return;
  if (game.hintsLeft <= 0) {
    showToast('Hint habis! Cari sendiri ya.');
    return;
  }
  const now = Date.now();
  if (now - game.lastHintAt < HINT_COOLDOWN_MS) {
    const wait = Math.ceil((HINT_COOLDOWN_MS - (now - game.lastHintAt)) / 1000);
    showToast(`Hint cooldown — tunggu ${wait} detik lagi.`);
    return;
  }
  const remaining = diffs().filter((d) => !game.found.has(d.id));
  if (!remaining.length) return;
  // Pilih acak tapi deterministik dari seed + jumlah temuan.
  const pick = remaining[(seed + game.found.size) % remaining.length];
  game.hintDiff = pick;
  game.hintUntil = now + HINT_SHOW_MS;
  game.hintsLeft -= 1;
  game.lastHintAt = now;
  playHint();
  showToast('Hint: lihat lingkaran kuning!');
  updateHud();
  render();
  setTimeout(() => {
    game.hintDiff = null;
    render();
  }, HINT_SHOW_MS);
}

function onFound(d) {
  game.found.add(d.id);
  game.foundList.push(d);
  game.score += POINTS_PER_FIND;
  playFound();
  showToast(`✓ ${d.label}  (+${POINTS_PER_FIND})`);
  if (game.found.size === diffs().length) {
    const bonus = Math.ceil(game.timeLeft) * TIME_BONUS_PER_SECOND;
    game.score += bonus;
    stopTimer();
    if (game.round < 2) {
      game.state = 'roundClear';
      playWin();
      render();
      showOverlay(
        `Ronde ${game.round + 1} Selesai!`,
        `Semua 7 perbedaan ketemu. Bonus waktu +${bonus} poin. Skor: ${game.score}. Siap naik level? Ronde berikutnya lebih sulit dan waktunya lebih singkat.`,
        'Lanjut ke Ronde Berikutnya ▶',
      );
    } else {
      winGame(bonus);
    }
  }
  updateHud();
  render();
}

function winGame(bonus) {
  game.state = 'win';
  playWin();
  render();
  showOverlay(
    '🎉 Kamu Menang!',
    `Semua 21 perbedaan di 3 ronde ketemu! Bonus waktu ronde terakhir +${bonus} poin. Skor akhir: ${game.score}. Kamu Detektif Senja sejati — taman desa aman berkat matamu yang tajam.`,
    'Main Lagi ↻',
  );
}

function loseGame() {
  game.state = 'lose';
  stopTimer();
  playLose();
  render();
  showOverlay(
    '⏰ Waktu Habis!',
    `Kamu menemukan ${game.found.size} dari 7 perbedaan di ${ROUNDS[game.round].name}. Skor: ${game.score}. Coba lagi — perbedaan yang belum ketemu masih menunggu di taman.`,
    'Coba Lagi ↻',
  );
}

function restart() {
  game.score = 0;
  startRound(0);
}

canvas.addEventListener('click', (e) => {
  unlockAudio();
  if (game.state !== 'play') return;
  const hit = mapClickToPanel(canvas, e.clientX, e.clientY);
  if (!hit) return;
  const d = pickDiffAt(diffs(), game.found, hit.x, hit.y);
  if (d) {
    onFound(d);
  } else {
    playWrong();
    game.timeLeft = Math.max(0, game.timeLeft - WRONG_CLICK_PENALTY_S);
    showToast(`Bukan itu — minus ${WRONG_CLICK_PENALTY_S} detik!`);
    updateHud();
    render();
  }
});

overlayBtn.addEventListener('click', () => {
  unlockAudio();
  playClick();
  if (game.state === 'start') return startRound(0);
  if (game.state === 'roundClear') return startRound(game.round + 1);
  if (game.state === 'win' || game.state === 'lose') return restart();
});

bindKeyboard((k) => {
  unlockAudio();
  if (k === 'h') return useHint();
  if (k === 'r') return restart();
  if (k === '1' || k === '2' || k === '3') {
    game.score = 0;
    return startRound(Number(k) - 1);
  }
  if ((k === 'enter' || k === ' ') && game.state !== 'play') overlayBtn.click();
});

// Boot: layar judul dulu; ?shot mengunci state untuk screenshot.
function boot() {
  if (shot === 'play') {
    startRound(0, 3);
    return;
  }
  if (shot === 'end') {
    game.score = 2100 + 75 * TIME_BONUS_PER_SECOND;
    for (const d of diffs()) {
      game.found.add(d.id);
      game.foundList.push(d);
    }
    game.state = 'win';
    updateHud();
    hudRound.textContent = 'Semua ronde selesai ✓';
    render();
    showOverlay(
      '🎉 Kamu Menang!',
      `Semua 21 perbedaan di 3 ronde ketemu! Skor akhir: ${game.score}. Kamu Detektif Senja sejati — taman desa aman berkat matamu yang tajam.`,
      'Main Lagi ↻',
    );
    return;
  }
  // Default dan ?shot=start: layar judul di atas scene ronde 1.
  game.state = 'start';
  updateHud();
  render();
  showOverlay(
    '🔍 Sore di Taman Desa',
    'Cari 7 perbedaan di antara dua gambar yang nyaris identik! Klik perbedaannya di gambar kiri atau kanan. 3 ronde, makin lama makin sulit. H = hint (maks 3), R = restart, 1/2/3 = pilih ronde. Klik yang salah mengurangi waktu 3 detik!',
    '▶ Mulai Bermain',
  );
}

boot();
