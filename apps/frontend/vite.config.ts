import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Variables documentadas en apps/frontend/.env.example.
  const entorno = loadEnv(mode, import.meta.dirname, '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // En la compu, /api va al backend local.
      proxy: {
        '/api': {
          target: entorno.BACKEND_URL || 'http://localhost:3000',
          rewrite: (ruta: string) => ruta.replace(/^\/api/, ''),
        },
      },
    },
  };
});
