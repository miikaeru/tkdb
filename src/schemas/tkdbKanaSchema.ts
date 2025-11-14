import {z} from 'zod';

export const TKDBKanaSchema = z.array(
  z.object({
    literal: z.string(),
    romaji: z.string(),
    mnemonic: z.string().optional(),
    mnemonicPath: z.string().optional(),
    gojuonColumn: z.number(),
    gojuonRow: z.number(),
    kanaType: z.enum(['mono', 'mono_dia', 'di', 'di_dia']),
    script: z.enum(['hira', 'kata']),
    studyOrder: z.number(),
    strokes: z
      .array(z.object({path: z.string(), x: z.string(), y: z.string()}))
      .optional(),
  }),
);

export type TKDBKana = z.infer<typeof TKDBKanaSchema>;
