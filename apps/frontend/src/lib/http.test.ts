import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ErrorHttp, pedir } from './http';

const Esquema = z.object({ estado: z.literal('ok') });

const responder = (cuerpo: string, estado: number) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(cuerpo, { status: estado })),
  );

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pedir', () => {
  it('devuelve los datos ya validados', async () => {
    responder(JSON.stringify({ estado: 'ok' }), 200);
    await expect(pedir('/health', Esquema)).resolves.toEqual({ estado: 'ok' });
  });

  it('si el servidor responde con error, avisa con el código', async () => {
    responder('', 503);
    await expect(pedir('/health', Esquema)).rejects.toBeInstanceOf(ErrorHttp);
  });

  it('si la respuesta no tiene la forma esperada, no la deja pasar', async () => {
    responder(JSON.stringify({ estado: 'roto' }), 200);
    await expect(pedir('/health', Esquema)).rejects.toThrow();
  });
});
