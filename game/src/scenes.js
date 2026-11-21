// scenes.js — semua art digambar di Canvas 2D, tanpa gambar eksternal.
// Satu scene orisinal: "Sore di Taman Desa". Panel kiri adalah acuan,
// panel kanan digambar sama persis kecuali modifikasi dari differences.js.
import { PANEL_W, PANEL_H, PALETTE } from './config.js';
import { diffsForRound } from './differences.js';

function hasDiff(roundIndex, isRight, id) {
  if (!isRight) return false;
  return diffsForRound(roundIndex).some((d) => d.id === id);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y, scale = 1) {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 9 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 7 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 7 * scale, x + 9 * scale, y);
  ctx.stroke();
}

function cloud(ctx, x, y, s = 1) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  circle(ctx, x, y, 16 * s);
  circle(ctx, x + 16 * s, y + 3 * s, 12 * s);
  circle(ctx, x - 16 * s, y + 4 * s, 11 * s);
  ctx.fillRect(x - 22 * s, y, 46 * s, 10 * s);
}

function flower(ctx, x, y, petal) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6);
  }
  ctx.fillStyle = '#ffeb3b';
  circle(ctx, x, y, 5);
}

function apple(ctx, x, y) {
  ctx.fillStyle = '#e53935';
  circle(ctx, x, y, 7);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x + 3, y - 11);
  ctx.stroke();
}

// Gambar satu panel lengkap. isRight=true berarti panel kanan (berbeda).
export function drawScene(ctx, roundIndex, isRight) {
  const R = (id) => hasDiff(roundIndex, isRight, id);

  // Langit senja.
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H * 0.62);
  sky.addColorStop(0, PALETTE.skyTop);
  sky.addColorStop(0.55, PALETTE.skyMid);
  sky.addColorStop(1, PALETTE.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Bintang pertama (ronde 3, kanan saja).
  if (R('star-sky')) {
    ctx.fillStyle = '#fffde7';
    ctx.save();
    ctx.translate(425, 42);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 === 0 ? 10 : 4;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Matahari + kacamata hitam (ronde 1, kanan saja).
  ctx.fillStyle = PALETTE.sun;
  circle(ctx, 88, 66, 34);
  ctx.strokeStyle = '#f9a825';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(88 + Math.cos(a) * 40, 66 + Math.sin(a) * 40);
    ctx.lineTo(88 + Math.cos(a) * 48, 66 + Math.sin(a) * 48);
    ctx.stroke();
  }
  if (R('sun-glasses')) {
    ctx.fillStyle = '#222';
    ctx.fillRect(68, 58, 16, 10);
    ctx.fillRect(92, 58, 16, 10);
    ctx.fillRect(84, 61, 8, 3);
  }

  // Awan (ronde 2: satu awan kecil tambahan di kanan).
  cloud(ctx, 180, 40, 1);
  cloud(ctx, 340, 34, 0.8);
  if (R('cloud-extra')) cloud(ctx, 252, 46, 0.55);

  // Burung: tiga di kiri, dua di kanan (ronde 1).
  bird(ctx, 240, 58);
  bird(ctx, 275, 48, 0.9);
  if (!R('bird-missing')) bird(ctx, 305, 58, 0.85);

  // Layang-layang (ronde 2: ekor lebih pendek di kanan).
  ctx.fillStyle = '#ab47bc';
  ctx.beginPath();
  ctx.moveTo(152, 100);
  ctx.lineTo(172, 118);
  ctx.lineTo(152, 136);
  ctx.lineTo(132, 118);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(152, 136);
  ctx.lineTo(160, 165);
  ctx.stroke();
  const tailLen = R('kite-tail') ? 1 : 3;
  for (let i = 0; i < tailLen; i++) {
    ctx.fillStyle = i % 2 ? '#ffca28' : '#ef5350';
    circle(ctx, 158 + i * 3, 168 + i * 9, 4);
  }

  // Balon (ronde 1: biru di kiri, hijau di kanan).
  ctx.fillStyle = R('balloon-green') ? '#66bb6a' : '#42a5f5';
  ellipse(ctx, 505, 92, 16, 20);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(505, 112);
  ctx.lineTo(505, 132);
  ctx.stroke();

  // Bukit dan rumput.
  ctx.fillStyle = PALETTE.grassDark;
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.quadraticCurveTo(180, 225, 360, 258);
  ctx.quadraticCurveTo(480, 278, PANEL_W, 250);
  ctx.lineTo(PANEL_W, PANEL_H);
  ctx.lineTo(0, PANEL_H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.grass;
  ctx.fillRect(0, 300, PANEL_W, PANEL_H - 300);

  // Jalan setapak + batu pijakan (ronde 3: satu batu hilang di kanan).
  ctx.fillStyle = PALETTE.path;
  ctx.beginPath();
  ctx.moveTo(180, PANEL_H);
  ctx.lineTo(240, 300);
  ctx.lineTo(300, 300);
  ctx.lineTo(360, PANEL_H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d7b98a';
  ellipse(ctx, 240, 330, 22, 8);
  ellipse(ctx, 270, 362, 22, 8);
  if (!R('stone-missing')) ellipse(ctx, 202, 392, 22, 8);
  ellipse(ctx, 300, 392, 22, 8);

  // Rumah di kanan atas bukit.
  ctx.fillStyle = PALETTE.houseWall;
  ctx.fillRect(430, 165, 95, 85);
  ctx.fillStyle = PALETTE.houseRoof;
  ctx.beginPath();
  ctx.moveTo(420, 168);
  ctx.lineTo(478, 128);
  ctx.lineTo(535, 168);
  ctx.closePath();
  ctx.fill();
  // Cerobong + asap (ronde 3: asap hilang di kanan).
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(498, 128, 14, 30);
  if (!R('smoke-off')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 482, 138, 8);
    circle(ctx, 476, 124, 11);
    circle(ctx, 484, 110, 8);
  }
  // Pintu dan jendela (ronde 1: jendela menyala di kanan).
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(468, 205, 22, 45);
  ctx.fillStyle = R('window-lit') ? '#ffeb3b' : '#37474f';
  ctx.fillRect(438, 182, 20, 20);
  ctx.fillRect(498, 182, 20, 20);
  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 2;
  ctx.strokeRect(438, 182, 20, 20);
  ctx.strokeRect(498, 182, 20, 20);

  // Pohon apel kiri (ronde 2: satu apel hilang di kanan).
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(74, 240, 16, 60);
  ctx.fillStyle = '#43a047';
  circle(ctx, 82, 205, 42);
  circle(ctx, 52, 228, 28);
  circle(ctx, 112, 228, 28);
  apple(ctx, 62, 218);
  if (!R('apple-missing')) apple(ctx, 82, 218);
  apple(ctx, 100, 232);

  // Kolam (ronde 2: bebek muncul di kanan).
  ctx.fillStyle = PALETTE.pond;
  ellipse(ctx, 452, 372, 62, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(440, 372, 18, 0.3, 2.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(468, 378, 14, 0.6, 2.6);
  ctx.stroke();
  if (R('duck-pond')) {
    ctx.fillStyle = '#fff59d';
    ellipse(ctx, 452, 366, 12, 8);
    circle(ctx, 462, 358, 6);
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(467, 358);
    ctx.lineTo(474, 360);
    ctx.lineTo(467, 362);
    ctx.closePath();
    ctx.fill();
  }

  // Pagar kayu (ronde 2: satu tiang hilang di kanan).
  ctx.fillStyle = PALETTE.wood;
  ctx.fillRect(230, 318, 130, 6);
  ctx.fillRect(230, 336, 130, 6);
  const posts = [238, 262, 286, 310, 334, 354];
  for (const px of posts) {
    if (R('fence-post') && px === 262) continue;
    ctx.fillRect(px, 306, 8, 44);
  }

  // Bangku (ronde 2: satu papan hilang di kanan; ronde 1: kucing di kanan).
  ctx.fillStyle = '#795548';
  ctx.fillRect(340, 300, 70, 8);
  if (!R('bench-slat')) ctx.fillRect(340, 314, 70, 8);
  ctx.fillRect(346, 308, 6, 26);
  ctx.fillRect(398, 308, 6, 26);
  if (R('cat-bench')) {
    ctx.fillStyle = '#ff9800';
    ellipse(ctx, 388, 292, 14, 9);
    circle(ctx, 400, 284, 7);
    ctx.beginPath();
    ctx.moveTo(396, 278);
    ctx.lineTo(398, 272);
    ctx.lineTo(401, 278);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(402, 278);
    ctx.lineTo(404, 272);
    ctx.lineTo(406, 278);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(376, 292);
    ctx.quadraticCurveTo(368, 282, 374, 274);
    ctx.stroke();
  }

  // Pak tani dengan topi (ronde 2: topi biru di kanan).
  ctx.fillStyle = '#fb8c00';
  circle(ctx, 322, 240, 11);
  ctx.fillStyle = R('hat-blue') ? '#1e88e5' : '#fdd835';
  ctx.beginPath();
  ctx.arc(322, 238, 14, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(306, 236, 32, 4);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(314, 252, 16, 26);
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(314, 258);
  ctx.lineTo(302, 268);
  ctx.moveTo(330, 258);
  ctx.lineTo(342, 268);
  ctx.stroke();

  // Kupu-kupu (ronde 1, kanan saja) dan lebah (ronde 3, kanan saja).
  if (R('butterfly')) {
    ctx.fillStyle = '#e91e63';
    ellipse(ctx, 198, 205, 8, 11);
    ellipse(ctx, 212, 205, 8, 11);
    ctx.fillStyle = '#333';
    ellipse(ctx, 205, 205, 3, 9);
  }
  if (R('bee')) {
    ctx.fillStyle = '#ffeb3b';
    ellipse(ctx, 282, 182, 8, 6);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(280, 176);
    ctx.lineTo(280, 188);
    ctx.moveTo(285, 176);
    ctx.lineTo(285, 188);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ellipse(ctx, 282, 174, 5, 3);
  }

  // Bunga-bunga (ronde 1: satu bunga merah di kanan).
  flower(ctx, 60, 350, '#ff80ab');
  flower(ctx, 118, 352, R('flower-red') ? '#e53935' : '#fff176');
  flower(ctx, 165, 348, '#ce93d8');
  flower(ctx, 540, 340, '#ff80ab');

  // Ember (ronde 3: terbalik di kanan).
  ctx.fillStyle = '#78909c';
  if (R('bucket-tipped')) {
    ctx.save();
    ctx.translate(102, 330);
    ctx.rotate(Math.PI);
    ctx.fillRect(-10, -8, 20, 16);
    ctx.restore();
    ctx.fillStyle = '#5db9e8';
    ellipse(ctx, 118, 336, 10, 3);
  } else {
    ctx.fillRect(92, 322, 20, 16);
    ctx.fillRect(90, 320, 24, 4);
  }

  // Papan petunjuk (ronde 3: panah berbalik di kanan).
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(338, 348, 6, 34);
  ctx.fillStyle = '#ffe082';
  ctx.fillRect(318, 352, 46, 14);
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  if (R('sign-arrow')) {
    ctx.moveTo(322, 359);
    ctx.lineTo(332, 353);
    ctx.lineTo(332, 365);
  } else {
    ctx.moveTo(360, 359);
    ctx.lineTo(350, 353);
    ctx.lineTo(350, 365);
  }
  ctx.closePath();
  ctx.fill();

  // Jamur (ronde 3, kanan saja).
  if (R('mushroom')) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(518, 378, 8, 10);
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(522, 378, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fff';
    circle(ctx, 518, 372, 2);
    circle(ctx, 526, 374, 2);
  }

  // Bingkai panel.
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, PANEL_W - 4, PANEL_H - 4);
}
