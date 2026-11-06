import express, { type ErrorRequestHandler, type Express } from 'express';
import type { Config } from './lib/config';
import { rutasDeSalud } from './modules/salud/salud.routes';

/** Arma la app sin ponerla a escuchar, así los tests la usan directo. */
export function crearApp(config: Config): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.use(rutasDeSalud(config));

  app.use((_pedido, respuesta) => {
    respuesta.status(404).json({ error: 'No existe esa ruta' });
  });

  const manejarError: ErrorRequestHandler = (error, _pedido, respuesta, _siguiente) => {
    // Nunca se registra el contenido del pedido: puede tener datos de chicos.
    console.error('Error no manejado:', error instanceof Error ? error.message : 'desconocido');
    respuesta.status(500).json({ error: 'Algo salió mal' });
  };
  app.use(manejarError);

  return app;
}
