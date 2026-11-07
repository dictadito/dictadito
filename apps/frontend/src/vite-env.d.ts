/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dirección del backend. En la compu, /api (lo redirige Vite). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
