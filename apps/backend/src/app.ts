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
    // Nunca se registra el contenido del pedido ni el mensaje del error: el mensaje puede traer
    // un pedazo de lo que se mandó (por ejemplo, un JSON roto), y ahí puede haber datos de chicos.
    const estado = estadoDelError(error);
    console.error('Error:', nombreDelError(error), estado);
    if (estado < 500) {
      respuesta.status(estado).json({ error: 'El pedido no es válido' });
      return;
    }
    respuesta.status(500).json({ error: 'Algo salió mal' });
  };
  app.use(manejarError);

  return app;
}

/** El código HTTP que trae el error (los de un pedido mal armado traen 4xx); si no trae, 500. */
function estadoDelError(error: unknown): number {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const estado = error.status;
    if (typeof estado === 'number' && estado >= 400 && estado < 600) return estado;
  }
  return 500;
}

/** Solo el tipo de error, que nunca trae datos del pedido. */
function nombreDelError(error: unknown): string {
  return error instanceof Error ? error.name : 'desconocido';
}
