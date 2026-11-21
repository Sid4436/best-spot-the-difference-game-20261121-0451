// main.ts — program hand-in untuk "Sore di Taman Desa".
// Menyalin game/ dan screenshots/ dari samping file ini ke /output
// (di luar grader, MAKEFUN_OUTPUT_DIR menggantikannya), lalu menulis
// /output/dossier.json dengan buildDossier dari ./vendor/makefun-game.ts.
// Node 22, stdlib saja. Dijalankan dua kali oleh grader; kedua run harus
// menulis byte yang sama persis.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}
console.log(`hand-in ditulis ke ${out}`);

// Caps dari scorer lomba: teks dossier 160 KiB, maks 4 screenshot @256 KiB,
// game maks 993 file / 48 MiB, path maks 1000 byte.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
