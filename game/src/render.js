// render.js — menggambar kedua panel, marker lingkaran, HUD, dan layar.
// Marker digambar di KEDUA panel pada posisi perbedaan yang sudah ditemukan,
// jadi pemain melihat lingkaran hijau di kiri dan kanan.
import { PANEL_W, PANEL_GAP, CANVAS_W, CANVAS_H, MARKER_RADIUS } from './config.js';
import { drawScene } from './scenes.js';

export function drawPanels(ctx, roundIndex, foundIds, hintDiff, timeLeft) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  // Panel kiri (acuan) dan kanan (berbeda).
  ctx.save();
  drawScene(ctx, roundIndex, false);
  ctx.restore();
  ctx.save();
  ctx.translate(PANEL_W + PANEL_GAP, 0);
  drawScene(ctx, roundIndex, true);
  ctx.restore();

  // Marker hijau di kedua panel untuk setiap perbedaan yang ketemu.
  for (const d of foundIds) {
    drawMarker(ctx, d.x, d.y, '#2e7d32');
    drawMarker(ctx, PANEL_W + PANEL_GAP + d.x, d.y, '#2e7d32');
  }
  // Hint: lingkaran kuning berdenyut di satu perbedaan yang belum ketemu.
  if (hintDiff) {
    const pulse = 4 * Math.sin(Date.now() / 150);
    drawMarker(ctx, hintDiff.x, hintDiff.y, '#f9a825', MARKER_RADIUS + pulse, 4);
    drawMarker(ctx, PANEL_W + PANEL_GAP + hintDiff.x, hintDiff.y, '#f9a825', MARKER_RADIUS + pulse, 4);
  }
  // Label "KIRI" / "KANAN" kecil di atas tiap panel.
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillText('ASLI', 12, 24);
  ctx.fillText('ADA 7 PERBEDAAN', PANEL_W + PANEL_GAP + 12, 24);
  void timeLeft;
}

function drawMarker(ctx, x, y, color, radius = MARKER_RADIUS, width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  // Centang kecil di tengah marker temuan.
  if (color === '#2e7d32') {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x - 2, y + 6);
    ctx.lineTo(x + 9, y - 6);
    ctx.stroke();
  }
}

// Layar judul / menang / kalah digambar sebagai overlay DOM (lihat main.js),
// fungsi ini hanya memberi latar gelap transparan di atas kanvas.
export function dimCanvas(ctx) {
  ctx.fillStyle = 'rgba(20, 16, 40, 0.45)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}
