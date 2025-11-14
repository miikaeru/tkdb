// Documentation
// https://kanjivg.tagaini.net/svg-format.html

import {z} from 'zod';

export const KVGKanjiPathSchema = z.object({
  id: z.string(),
  d: z.string(),
  type: z.string().optional(),
});

export type KVGKanjiPath = z.infer<typeof KVGKanjiPathSchema>;

export type KVGKanjiGroup = {
  id: string;
  element?: string;
  g?: KVGKanjiGroup | KVGKanjiGroup[];
  path?: KVGKanjiPath | KVGKanjiPath[];
  part?: string;
  variant?: string;
  radical?: string;
};

export const KVGKanjiGroupSchema: z.ZodType<KVGKanjiGroup> = z.lazy(() =>
  z.object({
    id: z.string(),
    element: z.string().optional(),
    g: z.union([KVGKanjiGroupSchema, z.array(KVGKanjiGroupSchema)]).optional(),
    path: z.union([KVGKanjiPathSchema, z.array(KVGKanjiPathSchema)]).optional(),
    part: z.string().optional(),
    variant: z.string().optional(),
    radical: z.string().optional(),
  }),
);

export const KVGSchema = z.object({
  kvg: z.string(),
  kanji: z.array(KVGKanjiGroupSchema),
});

export type KVG = z.infer<typeof KVGSchema>;
