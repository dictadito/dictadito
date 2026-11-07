import type { z } from 'zod';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/** El servidor respondió con un error (4xx o 5xx). */
export class ErrorHttp extends Error {
  readonly estado: number;

  constructor(estado: number) {
    super(`El servidor respondió con el código ${estado}`);
    this.name = 'ErrorHttp';
    this.estado = estado;
  }
}

/**
 * Único lugar del front que habla con el backend. Valida la respuesta con el esquema
 * de @dictadito/shared, así el front nunca trabaja con datos que tienen otra forma.
 */
export async function pedir<T>(
  ruta: string,
  esquema: z.ZodType<T>,
  opciones: RequestInit = {},
): Promise<T> {
  const encabezados = new Headers(opciones.headers);
  if (!encabezados.has('Content-Type')) encabezados.set('Content-Type', 'application/json');

  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    ...opciones,
    headers: encabezados,
    credentials: 'include',
  });
  if (!respuesta.ok) throw new ErrorHttp(respuesta.status);

  const datos: unknown = await respuesta.json();
  return esquema.parse(datos);
}
