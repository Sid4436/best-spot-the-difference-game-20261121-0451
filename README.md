[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sid4436/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sid4436/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Sore di Taman Desa — Spot the Difference

Cari 7 perbedaan di antara dua gambar taman desa saat senja yang nyaris identik! Sebuah game spot-the-difference orisinal yang lengkap: dua panel berdampingan, marker lingkaran hijau di setiap perbedaan yang ketemu, counter "Sisa perbedaan", timer, hint, dan 3 ronde dengan kesulitan yang naik (150 → 120 → 100 detik, perbedaan makin halus).

Semua art digambar dengan Canvas 2D di dalam kode — matahari berkacamata, kucing di bangku, bebek di kolam, lebah, jamur, dan 17 perbedaan lainnya tersebar di 3 ronde. Semua bunyi disintesis dengan WebAudio, tanpa satu pun file gambar atau suara eksternal. Game berjalan penuh offline dari file statis.

## Cara main

- Klik perbedaan di gambar kiri atau kanan — marker lingkaran + bunyi, skor +100
- `H` = hint (maks 3 per ronde, cooldown 10 detik)
- `R` = restart, `1`/`2`/`3` = pilih ronde
- Klik yang salah mengurangi waktu 3 detik
- Selesaikan satu ronde untuk bonus waktu (+5 poin/detik tersisa)

## Cara jalanin

```sh
node serve.ts
```

Lalu buka http://localhost:8080 di desktop Chrome.

## Struktur kode

- `game/index.html` + `game/style.css` — halaman dan tampilan
- `game/src/config.js` — angka dan palet yang mengatur permainan
- `game/src/differences.js` — 7 perbedaan per ronde (koordinat, label, jenis)
- `game/src/scenes.js` — semua art Canvas 2D "Sore di Taman Desa"
- `game/src/render.js` — dua panel, marker, dan layar
- `game/src/input.js` — klik mouse dan keyboard
- `game/src/audio.js` — bunyi WebAudio yang disintesis
- `game/src/main.js` — mesin permainan dan state
- `main.ts` — program hand-in: menyalin game/ + screenshots/ ke /output dan menulis dossier.json

## make.fun

Dibuat untuk lomba [Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) di make.fun. Masuk dengan referral `bzy4wq1r`: https://make.fun/r/bzy4wq1r
