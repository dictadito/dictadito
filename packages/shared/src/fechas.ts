/**
 * El día (AAAA-MM-DD) de una fecha en una zona horaria.
 *
 * Para esto nunca se usa toISOString(): da el día en UTC, y de noche en Córdoba
 * eso ya es el día siguiente. La zona horaria viene de la configuración, no se fija en el código.
 */
export function diaLocal(fecha: Date, zonaHoraria: string): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: zonaHoraria,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(fecha);
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value;
  return `${parte('year')}-${parte('month')}-${parte('day')}`;
}
