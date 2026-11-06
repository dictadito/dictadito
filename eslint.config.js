// Reglas del código. Las prohibiciones de abajo son las del CLAUDE.md: así no dependen de acordarse.
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const SOLO_EL_CLIENTE_HTTP =
  'Los pedidos al backend pasan por el cliente HTTP único: apps/frontend/src/lib/http.ts (pedir).';

export default defineConfig([
  // Los frenos de Claude y de git se prueban con su propia batería (npm run test:frenos).
  globalIgnores(['**/dist/', '**/coverage/', '.claude/', '.githooks/']),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    rules: {
      // Nada de catch vacío: un error tragado en silencio después no se encuentra.
      'no-empty': ['error', { allowEmptyCatch: false }],
      // Archivos chicos: si uno crece de más, se parte.
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      // De noche en Córdoba, toISOString() da el día siguiente.
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='toISOString']",
          message:
            'Nunca toISOString() para obtener un día: de noche en Córdoba da el día siguiente. Usá diaLocal() de @dictadito/shared.',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['scripts/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  {
    files: ['apps/backend/**/*.ts', '**/*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['apps/frontend/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-globals': ['error', { name: 'fetch', message: SOLO_EL_CLIENTE_HTTP }],
      'no-restricted-properties': [
        'error',
        { object: 'window', property: 'fetch', message: SOLO_EL_CLIENTE_HTTP },
        { object: 'globalThis', property: 'fetch', message: SOLO_EL_CLIENTE_HTTP },
      ],
    },
  },

  {
    files: ['apps/frontend/src/lib/http.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },
]);
