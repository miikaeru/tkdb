import {RawKana, RawKanaSchema} from '../schemas/rawKanaSchema';
import {readJsonFile} from '../utils';

let rawKana: RawKana | null = null;

export async function getRawKana(): Promise<RawKana> {
  if (!rawKana) {
    rawKana = await readJsonFile<RawKana>('input/tkdb_kana_raw.json');
    RawKanaSchema.parse(rawKana);
  }
  return rawKana;
}
