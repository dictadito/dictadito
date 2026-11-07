import { describe, expect, it } from 'vitest';
import { leerConfig } from './config';

describe('leerConfig', () => {
  it('sin variables usa los valores para trabajar en la compu', () => {
    expect(leerConfig({})).toEqual({
      puerto: 3000,
      ambiente: 'local',
      version: 'dev',
      commit: null,
    });
  });

  it('toma las variables del entorno', () => {
    const config = leerConfig({
      PORT: '8080',
      AMBIENTE: 'staging',
      APP_VERSION: '0.1.0',
      GIT_COMMIT: 'abc1234',
    });
    expect(config).toEqual({
      puerto: 8080,
      ambiente: 'staging',
      version: '0.1.0',
      commit: 'abc1234',
    });
  });

  it('si una variable está mal, dice cuál sin mostrar su valor', () => {
    expect(() => leerConfig({ PORT: 'valor-secreto' })).toThrow(/PORT/);
    expect(() => leerConfig({ PORT: 'valor-secreto' })).not.toThrow(/valor-secreto/);
  });

  it('no acepta un ambiente que no existe', () => {
    expect(() => leerConfig({ AMBIENTE: 'prod' })).toThrow(/AMBIENTE/);
  });
});
