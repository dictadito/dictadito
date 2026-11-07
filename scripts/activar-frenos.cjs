'use strict';
// Se corre solo con `npm install` (script "prepare" de package.json).
// Activa el freno de git en esta compu: le dice a git que use los hooks de la carpeta
// .githooks/ del repo. Avisa si falta gitleaks, porque sin él git no deja hacer commits.

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const raiz = path.resolve(__dirname, '..');
const git = (args) => spawnSync('git', args, { cwd: raiz, encoding: 'utf8' });

if (git(['rev-parse', '--is-inside-work-tree']).status !== 0) {
  console.log(
    '[frenos] Esta carpeta todavía no es un repo de git: el freno de git se activa cuando lo sea (corré npm install de nuevo).',
  );
  process.exit(0);
}

const r = git(['config', 'core.hooksPath', '.githooks']);
if (r.status !== 0) {
  console.error(`[frenos] No pude activar el freno de git: ${(r.stderr || '').trim()}`);
  process.exit(1);
}

// En Mac y Linux el hook tiene que ser ejecutable (en Windows no hace falta).
if (process.platform !== 'win32') {
  try {
    fs.chmodSync(path.join(raiz, '.githooks', 'pre-commit'), 0o755);
  } catch (err) {
    console.error(`[frenos] No pude marcar .githooks/pre-commit como ejecutable: ${err.message}`);
  }
}

console.log('[frenos] Freno de git activado (core.hooksPath = .githooks).');

if (spawnSync('gitleaks', ['version'], { encoding: 'utf8' }).status !== 0) {
  console.warn(
    '[frenos] Atención: falta gitleaks. Sin él, git no te va a dejar hacer commits.\n' +
      '         Instalalo con: winget install --id Gitleaks.Gitleaks -e\n' +
      '         (después cerrá y abrí de nuevo la terminal y VS Code)',
  );
}
console.log('[frenos] Para comprobar que todo anda: npm run probar-frenos');
