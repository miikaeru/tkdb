import {getKanjivgMap} from '../files/kanjivg';
import {getRawKana} from '../files/rawKana';
import {TKDBKana, TKDBKanaSchema} from '../schemas/tkdbKanaSchema';
import {writeCSVFile, writeJsonFile} from '../utils';
import {parseStrokes} from '../utils/kvgUtils';

export const main = async (): Promise<void> => {
  const rawKana = await getRawKana();
  const kanjivgMap = await getKanjivgMap();

  const tkdbKana: TKDBKana = [];

  for (const kana of rawKana) {
    const literal = kana.literal;
    const strokes = parseStrokes(kanjivgMap, literal);

    tkdbKana.push({
      literal,
      romaji: kana.romaji,
      mnemonic: kana.mnemonic ?? undefined,
      mnemonicPath: kana.mnemonic_path ?? undefined,
      gojuonColumn: kana.gojuon_column,
      gojuonRow: kana.gojuon_row,
      kanaType: kana.kana_type,
      script: kana.script,
      studyOrder: kana.study_order,
      strokes,
    });
  }

  TKDBKanaSchema.parse(tkdbKana);
  await writeJsonFile(tkdbKana, 'tkdb_kana.json');

  await writeCSVFile(tkdbKana, 'tkdb_kana.csv');
};

void main();
