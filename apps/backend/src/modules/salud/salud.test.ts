import { SaludSchema, VersionSchema } from '@dictadito/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { crearApp } from '../../app';
import type { Config } from '../../lib/config';

const config: Config = { puerto: 0, ambiente: 'local', version: '1.2.3', commit: 'abc1234' };
const app = crearApp(config);

describe('salud', () => {
  it('GET /health responde que está vivo', async () => {
    const respuesta = await request(app).get('/health');
    expect(respuesta.status).toBe(200);
    expect(SaludSchema.parse(respuesta.body)).toEqual({ estado: 'ok' });
  });

  it('GET /version dice la versión, el commit y el ambiente', async () => {
    const respuesta = await request(app).get('/version');
    expect(respuesta.status).toBe(200);
    expect(VersionSchema.parse(respuesta.body)).toEqual({
      version: '1.2.3',
      commit: 'abc1234',
      ambiente: 'local',
    });
  });

  it('una ruta que no existe responde 404 en JSON', async () => {
    const respuesta = await request(app).get('/no-existe');
    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({ error: 'No existe esa ruta' });
  });

  it('no dice con qué está hecho el servidor', async () => {
    const respuesta = await request(app).get('/health');
    expect(respuesta.headers['x-powered-by']).toBeUndefined();
  });
});
