import { z } from 'zod';

// Las variables están documentadas en apps/backend/.env.example.
const VariablesSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  AMBIENTE: z.enum(['local', 'staging', 'produccion']).default('local'),
  APP_VERSION: z.string().min(1).default('dev'),
  GIT_COMMIT: z.string().min(1).optional(),
});

export type Config = {
  puerto: number;
  ambiente: z.infer<typeof VariablesSchema>['AMBIENTE'];
  version: string;
  commit: string | null;
};

/** Lee la configuración del entorno. Si algo está mal, no arranca y dice qué variable revisar. */
export function leerConfig(entorno: Record<string, string | undefined> = process.env): Config {
  const resultado = VariablesSchema.safeParse(entorno);
  if (!resultado.success) {
    // Solo los nombres de las variables, nunca sus valores: pueden ser claves.
    const variables = resultado.error.issues.map((problema) => problema.path.join('.')).join(', ');
    throw new Error(`Configuración inválida en: ${variables}. Revisá apps/backend/.env.example.`);
  }
  const variables = resultado.data;
  return {
    puerto: variables.PORT,
    ambiente: variables.AMBIENTE,
    version: variables.APP_VERSION,
    commit: variables.GIT_COMMIT ?? null,
  };
}
