// config.js — satu tempat untuk semua angka yang mengatur permainan.
// "Sore di Taman Desa": dua panel kanvas berdampingan, 7 perbedaan per ronde.
export const PANEL_W = 560;
export const PANEL_H = 420;
export const PANEL_GAP = 24;
export const CANVAS_W = PANEL_W * 2 + PANEL_GAP;
export const CANVAS_H = PANEL_H;

export const ROUNDS = [
  { name: 'Ronde 1 — Sore yang Tenang', timeLimit: 150, hintMax: 3 },
  { name: 'Ronde 2 — Mata Elang', timeLimit: 120, hintMax: 3 },
  { name: 'Ronde 3 — Detektif Senja', timeLimit: 100, hintMax: 3 },
];

export const HINT_COOLDOWN_MS = 10000;
export const HINT_SHOW_MS = 2200;
export const MARKER_RADIUS = 26;
export const WRONG_CLICK_PENALTY_S = 3;
export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 5;

// Warna tema senja desa — dipakai scene dan HUD agar satu gaya.
export const PALETTE = {
  skyTop: '#ffb347',
  skyMid: '#ff8c69',
  skyLow: '#ffd9a0',
  sun: '#fff176',
  grass: '#7ec850',
  grassDark: '#5da83c',
  path: '#e8c890',
  houseWall: '#fff3d6',
  houseRoof: '#c0392b',
  pond: '#5db9e8',
  wood: '#8b5a2b',
};
