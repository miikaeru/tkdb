import {z} from 'zod';

export const RawKanaSchema = z.array(
  z.object({
    literal: z.string(),
    romaji: z.string(),
    mnemonic: z.union([z.string(), z.null()]),
    mnemonic_path: z.union([z.string(), z.null()]),
    gojuon_column: z.number(),
    gojuon_row: z.number(),
    kana_type: z.enum(['mono', 'mono_dia', 'di', 'di_dia']),
    script: z.enum(['hira', 'kata']),
    study_order: z.number(),
  }),
);

export type RawKana = z.infer<typeof RawKanaSchema>;
