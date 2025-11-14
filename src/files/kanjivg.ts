import {KVG, KVGKanjiGroup, KVGSchema} from '../schemas/kanjivgSchema';
import {readJsonFile} from '../utils';

let kanjivg: KVG | null = null;
let kanjivgMap: Map<string, KVGKanjiGroup> | null = null;

export async function getKanjivg(): Promise<KVG> {
  if (!kanjivg) {
    kanjivg = await readJsonFile<KVG>('input/converted/kanjivg.json');
    KVGSchema.parse(kanjivg);

    kanjivgMap = new Map(kanjivg.kanji.map(item => [item.id, item]));
  }
  return kanjivg;
}

export async function getKanjivgMap(): Promise<Map<string, KVGKanjiGroup>> {
  if (!kanjivgMap) {
    await getKanjivg();
    if (!kanjivgMap) throw new Error('Tanos vocab not loaded yet');
  }
  return kanjivgMap;
}
