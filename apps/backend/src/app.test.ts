import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { crearApp } from './app';
import type { Config } from './lib/config';

const config: Config = { puerto: 0, ambiente: 'local', version: '1.2.3', commit: 'abc1234' };

describe('errores', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('un pedido con el JSON roto responde 400 y no anota nada de lo que se mandó', async () => {
    const registro = vi.spyOn(console, 'error').mockImplementation(() => {});

    const respuesta = await request(crearApp(config))
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{"alumno": Juana Inventada, "valor": "en proceso"}');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual({ error: 'El pedido no es válido' });
    const anotado = registro.mock.calls.flat().map(String).join(' ');
    expect(anotado).toContain('SyntaxError');
    expect(anotado).not.toContain('Juana');
    expect(anotado).not.toContain('alumno');
  });
});
