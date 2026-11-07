import { SaludSchema, VersionSchema } from '@dictadito/shared';
import { Router } from 'express';
import type { Config } from '../../lib/config';

/** /health dice si el backend está vivo; /version, qué versión corre y en qué ambiente. */
export function rutasDeSalud(config: Config): Router {
  const rutas = Router();

  rutas.get('/health', (_pedido, respuesta) => {
    respuesta.json(SaludSchema.parse({ estado: 'ok' }));
  });

  rutas.get('/version', (_pedido, respuesta) => {
    respuesta.json(
      VersionSchema.parse({
        version: config.version,
        commit: config.commit,
        ambiente: config.ambiente,
      }),
    );
  });

  return rutas;
}
