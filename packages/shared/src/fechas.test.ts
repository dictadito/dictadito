import { describe, expect, it } from 'vitest';
import { diaLocal } from './fechas';

describe('diaLocal', () => {
  it('a las 23:30 en Córdoba sigue siendo el mismo día, aunque en UTC ya sea el siguiente', () => {
    const fecha = new Date(Date.UTC(2026, 10, 6, 2, 30)); // 6 de noviembre, 02:30 en UTC
    expect(diaLocal(fecha, 'America/Argentina/Cordoba')).toBe('2026-11-05');
    expect(diaLocal(fecha, 'UTC')).toBe('2026-11-06');
  });

  it('a la tarde da el mismo día en las dos zonas', () => {
    const fecha = new Date(Date.UTC(2026, 10, 6, 18, 0));
    expect(diaLocal(fecha, 'America/Argentina/Cordoba')).toBe('2026-11-06');
    expect(diaLocal(fecha, 'UTC')).toBe('2026-11-06');
  });
});
