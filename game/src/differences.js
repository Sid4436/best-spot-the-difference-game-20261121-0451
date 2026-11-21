// differences.js — daftar 7 perbedaan untuk tiap ronde.
// Koordinat dalam ruang panel (560 x 420). Setiap perbedaan punya:
//   id, x, y, r (radius klik), label (ditampilkan saat ketemu),
//   kind: 'add' (hanya ada di panel kanan), 'remove' (hilang di kanan),
//         'change' (wujudnya berubah di kanan).
// Scene menggambar panel kiri sebagai acuan, panel kanan dengan modifikasi ini.
export const ROUNDS_DIFFS = [
  // Ronde 1 — perbedaan besar dan jelas, pemanasan mata.
  [
    { id: 'sun-glasses', x: 88, y: 66, r: 30, label: 'Matahari pakai kacamata!', kind: 'add' },
    { id: 'bird-missing', x: 305, y: 58, r: 24, label: 'Satu burung hilang!', kind: 'remove' },
    { id: 'flower-red', x: 118, y: 352, r: 22, label: 'Bunga berubah merah!', kind: 'change' },
    { id: 'cat-bench', x: 388, y: 296, r: 28, label: 'Ada kucing di bangku!', kind: 'add' },
    { id: 'window-lit', x: 472, y: 182, r: 24, label: 'Jendela menyala!', kind: 'change' },
    { id: 'balloon-green', x: 505, y: 92, r: 24, label: 'Balon jadi hijau!', kind: 'change' },
    { id: 'butterfly', x: 205, y: 205, r: 24, label: 'Kupu-kupu muncul!', kind: 'add' },
  ],
  // Ronde 2 — perbedaan lebih kecil dan tersembunyi.
  [
    { id: 'cloud-extra', x: 252, y: 46, r: 26, label: 'Awan kecil tambahan!', kind: 'add' },
    { id: 'bench-slat', x: 362, y: 322, r: 22, label: 'Papan bangku hilang!', kind: 'remove' },
    { id: 'apple-missing', x: 82, y: 218, r: 20, label: 'Satu apel hilang!', kind: 'remove' },
    { id: 'duck-pond', x: 452, y: 372, r: 24, label: 'Bebek di kolam!', kind: 'add' },
    { id: 'kite-tail', x: 152, y: 122, r: 22, label: 'Ekor layang-layang pendek!', kind: 'change' },
    { id: 'fence-post', x: 262, y: 332, r: 20, label: 'Tiang pagar hilang!', kind: 'remove' },
    { id: 'hat-blue', x: 322, y: 252, r: 22, label: 'Topi pak tani jadi biru!', kind: 'change' },
  ],
  // Ronde 3 — perbedaan paling halus, butuh ketelitian.
  [
    { id: 'star-sky', x: 425, y: 42, r: 20, label: 'Bintang pertama muncul!', kind: 'add' },
    { id: 'stone-missing', x: 202, y: 392, r: 20, label: 'Batu pijakan hilang!', kind: 'remove' },
    { id: 'smoke-off', x: 482, y: 138, r: 22, label: 'Asap cerobong hilang!', kind: 'remove' },
    { id: 'bee', x: 282, y: 182, r: 18, label: 'Ada lebah!', kind: 'add' },
    { id: 'bucket-tipped', x: 102, y: 322, r: 22, label: 'Ember terbalik!', kind: 'change' },
    { id: 'sign-arrow', x: 342, y: 362, r: 20, label: 'Panah papan petunjuk berbalik!', kind: 'change' },
    { id: 'mushroom', x: 522, y: 382, r: 20, label: 'Jamur tumbuh!', kind: 'add' },
  ],
];

export function diffsForRound(roundIndex) {
  return ROUNDS_DIFFS[roundIndex] ?? ROUNDS_DIFFS[0];
}

// Cari perbedaan yang titik (px, py) kena, dari yang belum ditemukan.
export function pickDiffAt(diffs, foundIds, px, py) {
  for (const d of diffs) {
    if (foundIds.has(d.id)) continue;
    const dx = px - d.x;
    const dy = py - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return d;
  }
  return null;
}
