import { z } from 'zod';

/** Respuesta de GET /health: el backend está vivo. */
export const SaludSchema = z.object({
  estado: z.literal('ok'),
});
export type Salud = z.infer<typeof SaludSchema>;

/** Respuesta de GET /version: qué versión corre y en qué ambiente. */
export const VersionSchema = z.object({
  version: z.string().min(1),
  commit: z.string().min(1).nullable(),
  ambiente: z.string().min(1),
});
export type Version = z.infer<typeof VersionSchema>;
