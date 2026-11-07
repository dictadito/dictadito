import { defineConfig } from 'tsup';

// Arma un solo archivo para producción. El código de @dictadito/shared va adentro;
// las dependencias de npm (express, zod) quedan afuera y se instalan con npm ci.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  noExternal: ['@dictadito/shared'],
});
