// input.js — klik mouse dan keyboard.
// Klik dipetakan dari koordinat layar ke ruang panel (560x420), untuk
// panel kiri maupun kanan. Keyboard: H hint, R restart, 1/2/3 pilih ronde.
import { PANEL_W, PANEL_GAP } from './config.js';

// Kembalikan { panel: 0|1, x, y } dalam koordinat panel, atau null di luar panel.
export function mapClickToPanel(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  // Skala seragam: kanvas dirender selebar CSS-nya, jadi pakai rasio langsung.
  const sx = (PANEL_W * 2 + PANEL_GAP) / rect.width;
  const sy = 420 / rect.height;
  const cx = (clientX - rect.left) * sx;
  const cy = (clientY - rect.top) * sy;
  if (cy < 0 || cy > 420) return null;
  if (cx >= 0 && cx < PANEL_W) return { panel: 0, x: cx, y: cy };
  if (cx >= PANEL_W + PANEL_GAP && cx < PANEL_W * 2 + PANEL_GAP) {
    return { panel: 1, x: cx - PANEL_W - PANEL_GAP, y: cy };
  }
  return null;
}

export function bindKeyboard(onKey) {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'h' || k === 'r' || k === '1' || k === '2' || k === '3' || k === 'enter' || k === ' ') {
      e.preventDefault();
      onKey(k);
    }
  });
}
