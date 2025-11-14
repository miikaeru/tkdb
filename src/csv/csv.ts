import {Kanji, Radical, Word, TKDB, Categories} from 'tkdb-helper';
import {readJsonFile, writeCSVFile} from '../utils';
import {green} from 'chalk';

export default async (): Promise<void> => {
  const tkdb = await readJsonFile<TKDB>('output/tkdb.json');

  const categories = tkdb.categories;
  const radicals = tkdb.radicals;
  const kanjis = tkdb.kanjis;
  const words = tkdb.words;

  await createCategories(categories);
  await createRadical(radicals);
  await createKanji(kanjis);
  await createWords(words, kanjis);

  console.log(green('All CSV files are created'));
};

const createCategories = async (categories: Categories) => {
  const jlptCSV: string[][] = [];
  jlptCSV.push(['id', 'jlpt']);

  const gradeCSV: string[][] = [];
  gradeCSV.push(['id', 'grade']);

  const wordFormInfoCSV: string[][] = [];
  wordFormInfoCSV.push(['id', 'description']);

  const wordSensePosCSV: string[][] = [];
  wordSensePosCSV.push(['id', 'description']);

  const wordSenseFieldCSV: string[][] = [];
  wordSenseFieldCSV.push(['id', 'description']);

  const wordSenseMiscCSV: string[][] = [];
  wordSenseMiscCSV.push(['id', 'description']);

  const wordSenseDialectCSV: string[][] = [];
  wordSenseDialectCSV.push(['id', 'description']);

  const wordGlossTypeCSV: string[][] = [];
  wordGlossTypeCSV.push(['id', 'description']);

  const jlpt = categories.jlpt;
  const grade = categories.kanjiGrade;
  const formInfo = categories.wordFormInfo;
  const sensePos = categories.wordSensePos;
  const senseField = categories.wordSenseField;
  const senseMisc = categories.wordSenseMisc;
  const senseDialect = categories.wordSenseDial;
  const glossTypes = categories.wordGlossType;

  for (const [key, value] of Object.entries(jlpt)) {
    jlptCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(grade)) {
    gradeCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(formInfo)) {
    wordFormInfoCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(sensePos)) {
    wordSensePosCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(senseField)) {
    wordSenseFieldCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(senseMisc)) {
    wordSenseMiscCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(senseDialect)) {
    wordSenseDialectCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(glossTypes)) {
    wordGlossTypeCSV.push([key, value]);
  }

  await writeCSVFile(jlptCSV, 'output/csv/jlpt.csv');
  await writeCSVFile(gradeCSV, 'output/csv/grade.csv');
  await writeCSVFile(wordFormInfoCSV, 'output/csv/word_form_info.csv');
  await writeCSVFile(wordSensePosCSV, 'output/csv/word_sense_pos.csv');
  await writeCSVFile(wordSenseFieldCSV, 'output/csv/word_sense_field.csv');
  await writeCSVFile(wordSenseMiscCSV, 'output/csv/word_sense_misc.csv');
  await writeCSVFile(wordSenseDialectCSV, 'output/csv/word_sense_dial.csv');
  await writeCSVFile(wordGlossTypeCSV, 'output/csv/word_gloss_type.csv');
};

// const getRadicalId = (literal: string, radicals: Radical[]): string => {
//   const id = radicals.find(radical => radical.literal === literal)?.id;

//   if (id === undefined) {
//     throw new Error(`Radical with literal ${literal} was not found`);
//   }

//   return id;
// };

const createRadical = async (radicals: Radical[]) => {
  const radicalCsv: string[][] = [];
  radicalCsv.push([
    'literal',
    'number',
    'keyword',
    'mnemonic',
    'strokecount_id',
    'variant_of_literal',
  ]);

  const radicalMeaningCsv: string[][] = [];
  radicalMeaningCsv.push(['literal', 'position', 'meaning']);

  const radicalReadingCsv: string[][] = [];
  radicalReadingCsv.push(['literall', 'position', 'reading']);

  for (const radical of radicals) {
    const {literal} = radical;
    const keyword = radical.keyword ?? '';
    const mnemonic = radical.mnemonic ?? '';
    const number = String(radical.number ?? '');
    const strokecountId = String(radical.strokecount ?? '');
    const variantOfLiteral = radical.variantOf ?? '';

    radicalCsv.push([
      literal,
      number,
      keyword,
      mnemonic,
      strokecountId,
      variantOfLiteral,
    ]);

    const meanings = radical.meanings ?? [];
    const readings = radical.readings ?? [];

    let meaningIndex = 1;
    for (const meaning of meanings) {
      const position = String(meaningIndex);
      radicalMeaningCsv.push([literal, position, meaning]);
      meaningIndex++;
    }

    let readingIndex = 1;
    for (const reading of readings) {
      const position = String(readingIndex);
      radicalReadingCsv.push([literal, position, reading]);
      readingIndex++;
    }
  }

  await writeCSVFile(radicalCsv, 'output/csv/radical.csv');
  await writeCSVFile(radicalReadingCsv, 'output/csv/radical_reading.csv');
  await writeCSVFile(radicalMeaningCsv, 'output/csv/radical_meaning.csv');
};

// const getKanjiId = (literal: string, kanjis: Kanji[]): string => {
//   const id = kanjis.find(kanji => kanji.literal === literal)?.id;

//   if (id === undefined) {
//     throw new Error(`Kanji with literal ${literal} was not found`);
//   }

//   return id;
// };

const createKanji = async (kanjis: Kanji[]) => {
  const strokecounts = new Set<number>();

  const kanjiCsv: string[][] = [];
  kanjiCsv.push([
    'literal',
    'frequency',
    'keyword',
    'mnemonic',
    'strokecount_id',
    'jlpt_id',
    'grade_id',
  ]);

  const kanjiMeaningCsv: string[][] = [];
  kanjiMeaningCsv.push(['literal', 'position', 'meaning']);

  const kanjiKunCsv: string[][] = [];
  kanjiKunCsv.push(['literal', 'position', 'kun']);

  const kanjiOnCsv: string[][] = [];
  kanjiOnCsv.push(['literal', 'position', 'on']);

  const kanjiNanoriCsv: string[][] = [];
  kanjiNanoriCsv.push(['literal', 'position', 'nanori']);

  const kanjiAntonymCsv: string[][] = [];
  kanjiAntonymCsv.push(['literal', 'antonym_literal']);

  const kanjiLookalikeCsv: string[][] = [];
  kanjiLookalikeCsv.push(['literal', 'looklike_literal']);

  const kanjiSynonymCsv: string[][] = [];
  kanjiSynonymCsv.push(['literal', 'synonym_literal']);

  const kanjiStrokeCsv: string[][] = [];
  kanjiStrokeCsv.push(['literal', 'position', 'stroke', 'start_y', 'start_x']);

  const kanjiCompositionCsv: string[][] = [];
  kanjiCompositionCsv.push([
    'literal',
    'position',
    'child_kanji_literal',
    'child_radical_literal',
  ]);

  for (const kanji of kanjis) {
    const {literal} = kanji;

    const frequency = String(kanji.frequency ?? '');
    const keyword = kanji.keyword ?? '';
    const mnemonic = kanji.mnemonic ?? '';
    const strokecountId = String(kanji.strokecount ?? '');
    const gradeId = String(kanji.grade ?? '');
    const jlptId = String(kanji.jlpt ?? '');

    const meanings = kanji.meanings ?? [];
    const kuns = kanji.kun ?? [];
    const ons = kanji.on ?? [];
    const nanoris = kanji.nanori ?? [];
    const antonyms = kanji.antonyms ?? [];
    const lookalikes = kanji.lookalikes ?? [];
    const synonyms = kanji.synonyms ?? [];
    const strokes = kanji.strokes ?? [];
    const compositions = kanji.composition ?? [];

    let meaningIndex = 1;
    for (const meaning of meanings) {
      const position = String(meaningIndex);
      kanjiMeaningCsv.push([literal, position, meaning]);
      meaningIndex++;
    }

    let kunIndex = 1;
    for (const kun of kuns) {
      const position = String(kunIndex);
      kanjiKunCsv.push([literal, position, kun]);
      kunIndex++;
    }

    let onIndex = 1;
    for (const on of ons) {
      const position = String(onIndex);
      kanjiOnCsv.push([literal, position, on]);
      onIndex++;
    }

    let nanoriIndex = 1;
    for (const nanori of nanoris) {
      const position = String(nanoriIndex);
      kanjiNanoriCsv.push([literal, position, nanori]);
      nanoriIndex++;
    }

    for (const antonym of antonyms) {
      kanjiAntonymCsv.push([literal, antonym]);
    }

    for (const lookalike of lookalikes) {
      kanjiLookalikeCsv.push([literal, lookalike]);
    }

    for (const synonym of synonyms) {
      kanjiSynonymCsv.push([literal, synonym]);
    }

    let strokeIndex = 1;
    for (const stroke of strokes) {
      const position = String(strokeIndex);
      kanjiStrokeCsv.push([literal, position, stroke.path, stroke.y, stroke.x]);
      strokeIndex++;
    }

    let compositionIndex = 1;

    for (const composition of compositions) {
      const position = String(compositionIndex);
      const type = composition.type;

      const compositionKanji = type === 'kanji' ? composition.component : '';

      const compositionRadical =
        type === 'radical' ? composition.component : '';

      kanjiCompositionCsv.push([
        literal,
        position,
        compositionKanji,
        compositionRadical,
      ]);
      compositionIndex++;
    }

    strokecounts.add(kanji.strokecount);

    kanjiCsv.push([
      literal,
      frequency,
      keyword,
      mnemonic,
      strokecountId,
      jlptId,
      gradeId,
    ]);
  }

  const strokecountCsv: string[][] = [];
  strokecountCsv.push(['id', 'count']);

  const sortedStrokecounts = [...strokecounts].sort((a, b) => a - b);
  for (const sortedStrokecount of sortedStrokecounts) {
    const strokecount = String(sortedStrokecount);
    strokecountCsv.push([strokecount, strokecount]);
  }

  await writeCSVFile(kanjiCsv, 'output/csv/kanji.csv');
  await writeCSVFile(kanjiMeaningCsv, 'output/csv/kanji_meaning.csv');
  await writeCSVFile(kanjiKunCsv, 'output/csv/kanji_kun.csv');
  await writeCSVFile(kanjiOnCsv, 'output/csv/kanji_on.csv');
  await writeCSVFile(kanjiNanoriCsv, 'output/csv/kanji_nanori.csv');
  await writeCSVFile(kanjiAntonymCsv, 'output/csv/kanji_antonym.csv');
  await writeCSVFile(kanjiLookalikeCsv, 'output/csv/kanji_lookalike.csv');
  await writeCSVFile(kanjiSynonymCsv, 'output/csv/kanji_synonym.csv');
  await writeCSVFile(kanjiStrokeCsv, 'output/csv/kanji_stroke.csv');
  await writeCSVFile(kanjiCompositionCsv, 'output/csv/kanji_composition.csv');
  await writeCSVFile(strokecountCsv, 'output/csv/strokecount.csv');
};

const createWords = async (words: Word[], kanjis: Kanji[]) => {
  const wordCSV: string[][] = [];
  wordCSV.push(['id', 'jlpt_id']);

  const wordFormCSV: string[][] = [];
  wordFormCSV.push([
    'word_id',
    'id',
    'kanji',
    'kana',
    'position',
    'common',
    'outdated',
    'irregular',
    'rare',
    'search_only',
    'frequency',
    'jlpt_id',
  ]);

  const wordFormInfoCSV: string[][] = [];
  wordFormInfoCSV.push(['word_id', 'form_id', 'info_id']);

  const wordFuriganaCSV: string[][] = [];
  wordFuriganaCSV.push(['word_id', 'form_id', 'furigana']);

  const wordKanjiCSV: string[][] = [];
  wordKanjiCSV.push(['word_id', 'form_id', 'literal', 'position']);

  const wordSenseCSV: string[][] = [];
  wordSenseCSV.push(['word_id', 'id', 'position']);

  const wordSensePosCSV: string[][] = [];
  wordSensePosCSV.push(['word_id', 'sense_id', 'pos_id']);

  const wordSenseFieldCSV: string[][] = [];
  wordSenseFieldCSV.push(['word_id', 'sense_id', 'field_id']);

  const wordSenseMiscCSV: string[][] = [];
  wordSenseMiscCSV.push(['word_id', 'sense_id', 'misc_id']);

  const wordSenseDialectCSV: string[][] = [];
  wordSenseDialectCSV.push(['word_id', 'sense_id', 'dial_id']);

  const wordGlossCSV: string[][] = [];
  wordGlossCSV.push([
    'word_id',
    'sense_id',
    'position',
    'definition',
    'type_id',
  ]);

  const wordSenseInfoCSV: string[][] = [];
  wordSenseInfoCSV.push(['word_id', 'sense_id', 'position', 'info']);

  const wordSenseRestrictionCSV: string[][] = [];
  wordSenseRestrictionCSV.push([
    'word_id',
    'sense_id',
    'position',
    'restriction',
  ]);

  const wordPrimaryGlossesCSV: string[][] = [];
  wordPrimaryGlossesCSV.push(['word_id', 'glosses']);

  for (const word of words) {
    const {id, forms, senses} = word;
    const wordId = id.toString();

    wordCSV.push([wordId]);
    wordFuriganaCSV.push;

    let formIndex = 1;
    for (const form of forms) {
      const {
        kanji,
        kana,
        common,
        frequency,
        jlpt,
        id: formId,
        furigana,
        unusual,
        informations: infos,
        usedKanji: usedKanjiData,
      } = form;

      wordFormCSV.push([
        wordId,
        formId,
        kanji ?? '',
        kana,
        formIndex.toString(),
        common?.toString() ?? '',
        unusual?.toString() ?? '',
        frequency?.toString() ?? '',
        jlpt?.toString() ?? '',
      ]);

      if (infos) {
        for (const info of infos) {
          wordFormInfoCSV.push([wordId, formId, info]);
        }
      }

      if (furigana) {
        wordFuriganaCSV.push([wordId, formId, JSON.stringify(furigana)]);
      }

      if (usedKanjiData) {
        let kanjiPosition = 1;
        for (const usedKanji of usedKanjiData) {
          const literal = usedKanji;

          // Confirm the literal exists in kanji data before adding it to the CSV
          if (kanjis.find(kanji => kanji.literal === literal)) {
            wordKanjiCSV.push([
              wordId,
              formId,
              literal,
              kanjiPosition.toString(),
            ]);
            ++kanjiPosition;
          }
        }
      }

      ++formIndex;
    }

    let senseIndex = 1;
    for (const sense of senses) {
      const {
        id: senseId,
        posCategories,
        fieldCategories,
        miscCategories,
        dialectCategories,
        glosses,
        informations,
        restrictions,
      } = sense;

      if (posCategories) {
        for (const category of posCategories) {
          wordSensePosCSV.push([wordId, senseId, category]);
        }
      }

      if (fieldCategories) {
        for (const category of fieldCategories) {
          wordSenseFieldCSV.push([wordId, senseId, category]);
        }
      }

      if (miscCategories) {
        for (const category of miscCategories) {
          wordSenseMiscCSV.push([wordId, senseId, category]);
        }
      }

      if (dialectCategories) {
        for (const category of dialectCategories) {
          wordSenseDialectCSV.push([wordId, senseId, category]);
        }
      }

      if (informations) {
        let infoIndex = 0;
        for (const info of informations) {
          wordSenseInfoCSV.push([wordId, senseId, infoIndex.toString(), info]);
          ++infoIndex;
        }
      }

      if (restrictions) {
        let restrictionIndex = 0;
        for (const restriction of restrictions) {
          wordSenseRestrictionCSV.push([
            wordId,
            senseId,
            restrictionIndex.toString(),
            restriction,
          ]);
          ++restrictionIndex;
        }
      }

      let glossIndex = 1;
      for (const gloss of glosses) {
        const typeId = gloss.type ?? '';
        wordGlossCSV.push([
          wordId,
          senseId,
          glossIndex.toString(),
          gloss.definition,
          typeId,
        ]);
        ++glossIndex;
      }

      wordSenseCSV.push([wordId, senseId, senseIndex.toString()]);
      senseIndex++;
    }

    wordPrimaryGlossesCSV.push([wordId, JSON.stringify(word.primaryGlosses)]);
  }

  await writeCSVFile(wordCSV, 'output/csv/word.csv');
  await writeCSVFile(wordFormCSV, 'output/csv/word_form.csv');
  await writeCSVFile(wordFormInfoCSV, 'output/csv/word_form_x_info.csv');
  await writeCSVFile(wordFuriganaCSV, 'output/csv/word_form_furigana.csv');
  await writeCSVFile(wordKanjiCSV, 'output/csv/word_form_x_kanji.csv');
  await writeCSVFile(wordSenseCSV, 'output/csv/word_sense.csv');
  await writeCSVFile(wordSensePosCSV, 'output/csv/word_sense_x_pos.csv');
  await writeCSVFile(wordSenseFieldCSV, 'output/csv/word_sense_x_field.csv');
  await writeCSVFile(wordSenseMiscCSV, 'output/csv/word_sense_x_misc.csv');
  await writeCSVFile(wordSenseDialectCSV, 'output/csv/word_sense_x_dial.csv');
  await writeCSVFile(wordGlossCSV, 'output/csv/word_gloss.csv');
  await writeCSVFile(wordSenseInfoCSV, 'output/csv/word_sense_info.csv');
  await writeCSVFile(
    wordSenseRestrictionCSV,
    'output/csv/word_sense_restriction.csv'
  );
  await writeCSVFile(
    wordPrimaryGlossesCSV,
    'output/csv/word_primary_glosses.csv'
  );
};
