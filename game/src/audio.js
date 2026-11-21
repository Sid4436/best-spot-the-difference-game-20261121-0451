// audio.js — semua bunyi disintesis dengan WebAudio, tanpa file suara.
// Bunyi temuan yang memuaskan, bunyi salah yang pelan, dan jingle menang.
let ctx = null;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, startAt, dur, type = 'sine', vol = 0.18) {
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function playFound() {
  // Ding naik dua nada: "ketemu!" yang memuaskan.
  tone(660, 0, 0.14, 'sine', 0.22);
  tone(880, 0.1, 0.22, 'sine', 0.22);
  tone(1320, 0.2, 0.18, 'triangle', 0.1);
}

export function playWrong() {
  tone(180, 0, 0.18, 'sawtooth', 0.08);
  tone(140, 0.12, 0.2, 'sawtooth', 0.07);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.14);
  tone(780, 0.1, 0.16, 'triangle', 0.14);
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.13, 0.22, 'triangle', 0.18));
}

export function playLose() {
  const notes = [392, 330, 262, 196];
  notes.forEach((n, i) => tone(n, i * 0.18, 0.28, 'sine', 0.14));
}

export function playClick() {
  tone(440, 0, 0.06, 'square', 0.05);
}

export function unlockAudio() {
  ensureCtx();
}
