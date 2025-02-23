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
  await createKanji(kanjis, radicals);
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

  const wordMeaningPosCSV: string[][] = [];
  wordMeaningPosCSV.push(['id', 'description']);

  const wordMeaningFieldCSV: string[][] = [];
  wordMeaningFieldCSV.push(['id', 'description']);

  const wordMeaningMiscCSV: string[][] = [];
  wordMeaningMiscCSV.push(['id', 'description']);

  const wordMeaningDialectCSV: string[][] = [];
  wordMeaningDialectCSV.push(['id', 'description']);

  const wordTranslationTypeCSV: string[][] = [];
  wordTranslationTypeCSV.push(['id', 'description']);

  const jlpt = categories.jlpt;
  const grade = categories.kanjiGrade;
  const formInfo = categories.wordFormInfo;
  const meaningPos = categories.wordMeaningPos;
  const meaningField = categories.wordMeaningField;
  const meaningMisc = categories.wordMeaningMisc;
  const meaningDialect = categories.wordMeaningDial;
  const translationTypes = categories.wordTranslationType;

  for (const [key, value] of Object.entries(jlpt)) {
    jlptCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(grade)) {
    gradeCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(formInfo)) {
    wordFormInfoCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(meaningPos)) {
    wordMeaningPosCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(meaningField)) {
    wordMeaningFieldCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(meaningMisc)) {
    wordMeaningMiscCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(meaningDialect)) {
    wordMeaningDialectCSV.push([key, value]);
  }

  for (const [key, value] of Object.entries(translationTypes)) {
    wordTranslationTypeCSV.push([key, value]);
  }

  await writeCSVFile(jlptCSV, 'output/csv/jlpt.csv');
  await writeCSVFile(gradeCSV, 'output/csv/grade.csv');
  await writeCSVFile(wordFormInfoCSV, 'output/csv/word_form_info.csv');
  await writeCSVFile(wordMeaningPosCSV, 'output/csv/word_meaning_pos.csv');
  await writeCSVFile(wordMeaningFieldCSV, 'output/csv/word_meaning_field.csv');
  await writeCSVFile(wordMeaningMiscCSV, 'output/csv/word_meaning_misc.csv');
  await writeCSVFile(wordMeaningDialectCSV, 'output/csv/word_meaning_dial.csv');
  await writeCSVFile(
    wordTranslationTypeCSV,
    'output/csv/word_translation_type.csv'
  );
};

const getRadicalId = (literal: string, radicals: Radical[]): string => {
  const id = radicals.find(radical => radical.literal === literal)?.id;

  if (id === undefined) {
    throw new Error(`Radical with literal ${literal} was not found`);
  }

  return id;
};

const createRadical = async (radicals: Radical[]) => {
  const radicalCsv: string[][] = [];
  radicalCsv.push([
    'id',
    'literal',
    'number',
    'keyword',
    'mnemonic',
    'strokecount_id',
    'variant_of_id',
  ]);

  const radicalMeaningCsv: string[][] = [];
  radicalMeaningCsv.push(['radical_id', 'position', 'meaning']);

  const radicalReadingCsv: string[][] = [];
  radicalReadingCsv.push(['radical_id', 'position', 'reading']);

  for (const radical of radicals) {
    const {id, literal} = radical;
    const keyword = radical.keyword ?? '';
    const mnemonic = radical.mnemonic ?? '';
    const number = String(radical.number ?? '');
    const strokecountId = String(radical.strokecount ?? '');
    const variantOfId = radical.variantOf
      ? getRadicalId(radical.variantOf, radicals)
      : '';

    radicalCsv.push([
      id,
      literal,
      number,
      keyword,
      mnemonic,
      strokecountId,
      variantOfId,
    ]);

    const meanings = radical.meanings ?? [];
    const readings = radical.readings ?? [];

    let meaningIndex = 1;
    for (const meaning of meanings) {
      const position = String(meaningIndex);
      radicalMeaningCsv.push([id, position, meaning]);
      meaningIndex++;
    }

    let readingIndex = 1;
    for (const reading of readings) {
      const position = String(readingIndex);
      radicalReadingCsv.push([id, position, reading]);
      readingIndex++;
    }
  }

  await writeCSVFile(radicalCsv, 'output/csv/radical.csv');
  await writeCSVFile(radicalReadingCsv, 'output/csv/radical_reading.csv');
  await writeCSVFile(radicalMeaningCsv, 'output/csv/radical_meaning.csv');
};

const getKanjiId = (literal: string, kanjis: Kanji[]): string => {
  const id = kanjis.find(kanji => kanji.literal === literal)?.id;

  if (id === undefined) {
    throw new Error(`Kanji with literal ${literal} was not found`);
  }

  return id;
};

const createKanji = async (kanjis: Kanji[], radicals: Radical[]) => {
  const strokecounts = new Set<number>();

  const kanjiCsv: string[][] = [];
  kanjiCsv.push([
    'id',
    'literal',
    'frequency',
    'keyword',
    'mnemonic',
    'strokecount_id',
    'jlpt_id',
    'grade_id',
  ]);

  const kanjiMeaningCsv: string[][] = [];
  kanjiMeaningCsv.push(['kanji_id', 'position', 'meaning']);

  const kanjiKunCsv: string[][] = [];
  kanjiKunCsv.push(['kanji_id', 'position', 'kun']);

  const kanjiOnCsv: string[][] = [];
  kanjiOnCsv.push(['kanji_id', 'position', 'on']);

  const kanjiNanoriCsv: string[][] = [];
  kanjiNanoriCsv.push(['kanji_id', 'position', 'nanori']);

  const kanjiAntonymCsv: string[][] = [];
  kanjiAntonymCsv.push(['kanji_id', 'antonym_id']);

  const kanjiLookalikeCsv: string[][] = [];
  kanjiLookalikeCsv.push(['kanji_id', 'looklike_id']);

  const kanjiSynonymCsv: string[][] = [];
  kanjiSynonymCsv.push(['kanji_id', 'synonym_id']);

  const kanjiStrokeCsv: string[][] = [];
  kanjiStrokeCsv.push(['kanji_id', 'position', 'stroke', 'start_y', 'start_x']);

  const kanjiCompositionCsv: string[][] = [];
  kanjiCompositionCsv.push([
    'parent_kanji_id',
    'position',
    'child_kanji_id',
    'child_radical_id',
  ]);

  for (const kanji of kanjis) {
    const {id, literal} = kanji;

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
      kanjiMeaningCsv.push([id, position, meaning]);
      meaningIndex++;
    }

    let kunIndex = 1;
    for (const kun of kuns) {
      const position = String(kunIndex);
      kanjiKunCsv.push([id, position, kun]);
      kunIndex++;
    }

    let onIndex = 1;
    for (const on of ons) {
      const position = String(onIndex);
      kanjiOnCsv.push([id, position, on]);
      onIndex++;
    }

    let nanoriIndex = 1;
    for (const nanori of nanoris) {
      const position = String(nanoriIndex);
      kanjiNanoriCsv.push([id, position, nanori]);
      nanoriIndex++;
    }

    for (const antonym of antonyms) {
      const antonymId = getKanjiId(antonym, kanjis);
      kanjiAntonymCsv.push([id, antonymId]);
    }

    for (const lookalike of lookalikes) {
      const lookalikeId = getKanjiId(lookalike, kanjis);
      kanjiLookalikeCsv.push([id, lookalikeId]);
    }

    for (const synonym of synonyms) {
      const synonymId = getKanjiId(synonym, kanjis);
      kanjiSynonymCsv.push([id, synonymId]);
    }

    let strokeIndex = 1;
    for (const stroke of strokes) {
      const position = String(strokeIndex);
      kanjiStrokeCsv.push([id, position, stroke.path, stroke.y, stroke.x]);
      strokeIndex++;
    }

    let compositionIndex = 1;

    for (const composition of compositions) {
      const position = String(compositionIndex);
      const type = composition.type;

      const compositionKanjiId =
        type === 'kanji' ? getKanjiId(composition.element, kanjis) : '';

      const compositionRadicalId =
        type === 'radical' ? getRadicalId(composition.element, radicals) : '';

      kanjiCompositionCsv.push([
        id,
        position,
        compositionKanjiId,
        compositionRadicalId,
      ]);
      compositionIndex++;
    }

    strokecounts.add(kanji.strokecount);

    kanjiCsv.push([
      id,
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
  wordKanjiCSV.push(['word_id', 'form_id', 'kanji_id', 'position']);

  const wordMeaningCSV: string[][] = [];
  wordMeaningCSV.push(['word_id', 'id', 'position']);

  const wordMeaningPosCSV: string[][] = [];
  wordMeaningPosCSV.push(['word_id', 'meaning_id', 'pos_id']);

  const wordMeaningFieldCSV: string[][] = [];
  wordMeaningFieldCSV.push(['word_id', 'meaning_id', 'field_id']);

  const wordMeaningMiscCSV: string[][] = [];
  wordMeaningMiscCSV.push(['word_id', 'meaning_id', 'misc_id']);

  const wordMeaningDialectCSV: string[][] = [];
  wordMeaningDialectCSV.push(['word_id', 'meaning_id', 'dial_id']);

  const wordTranslationCSV: string[][] = [];
  wordTranslationCSV.push([
    'word_id',
    'meaning_id',
    'position',
    'translation',
    'type_id',
  ]);

  const wordMeaningInfoCSV: string[][] = [];
  wordMeaningInfoCSV.push(['word_id', 'meaning_id', 'position', 'info']);

  const wordMeaningRestrictionCSV: string[][] = [];
  wordMeaningRestrictionCSV.push([
    'word_id',
    'meaning_id',
    'position',
    'restriction',
  ]);

  const wordMeaningSummaryCSV: string[][] = [];
  wordMeaningSummaryCSV.push(['word_id', 'meanings']);

  for (const word of words) {
    const {id, forms, meanings} = word;
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

          try {
            const kanjiId = getKanjiId(literal, kanjis);
            wordKanjiCSV.push([
              wordId,
              formId,
              kanjiId,
              kanjiPosition.toString(),
            ]);
            ++kanjiPosition;
          } catch (error) {
            // Ignore the error and continue with the next character
          }
        }
      }

      ++formIndex;
    }

    let meaningIndex = 1;
    for (const meaning of meanings) {
      const {
        id: meaningId,
        posCategories,
        fieldCategories,
        miscCategories,
        dialectCategories,
        translations,
        informations,
        restrictions,
      } = meaning;

      if (posCategories) {
        for (const category of posCategories) {
          wordMeaningPosCSV.push([wordId, meaningId, category]);
        }
      }

      if (fieldCategories) {
        for (const category of fieldCategories) {
          wordMeaningFieldCSV.push([wordId, meaningId, category]);
        }
      }

      if (miscCategories) {
        for (const category of miscCategories) {
          wordMeaningMiscCSV.push([wordId, meaningId, category]);
        }
      }

      if (dialectCategories) {
        for (const category of dialectCategories) {
          wordMeaningDialectCSV.push([wordId, meaningId, category]);
        }
      }

      if (informations) {
        let infoIndex = 0;
        for (const info of informations) {
          wordMeaningInfoCSV.push([
            wordId,
            meaningId,
            infoIndex.toString(),
            info,
          ]);
          ++infoIndex;
        }
      }

      if (restrictions) {
        let restrictionIndex = 0;
        for (const restriction of restrictions) {
          wordMeaningRestrictionCSV.push([
            wordId,
            meaningId,
            restrictionIndex.toString(),
            restriction,
          ]);
          ++restrictionIndex;
        }
      }

      let translationIndex = 1;
      for (const translation of translations) {
        const typeId = translation.type ?? '';
        wordTranslationCSV.push([
          wordId,
          meaningId,
          translationIndex.toString(),
          translation.text,
          typeId,
        ]);
        ++translationIndex;
      }

      wordMeaningCSV.push([wordId, meaningId, meaningIndex.toString()]);
      meaningIndex++;
    }

    wordMeaningSummaryCSV.push([wordId, JSON.stringify(word.meaningsSummary)]);
  }

  await writeCSVFile(wordCSV, 'output/csv/word.csv');
  await writeCSVFile(wordFormCSV, 'output/csv/word_form.csv');
  await writeCSVFile(wordFormInfoCSV, 'output/csv/word_form_x_info.csv');
  await writeCSVFile(wordFuriganaCSV, 'output/csv/word_form_furigana.csv');
  await writeCSVFile(wordKanjiCSV, 'output/csv/word_form_x_kanji.csv');
  await writeCSVFile(wordMeaningCSV, 'output/csv/word_meaning.csv');
  await writeCSVFile(wordMeaningPosCSV, 'output/csv/word_meaning_x_pos.csv');
  await writeCSVFile(
    wordMeaningFieldCSV,
    'output/csv/word_meaning_x_field.csv'
  );
  await writeCSVFile(wordMeaningMiscCSV, 'output/csv/word_meaning_x_misc.csv');
  await writeCSVFile(
    wordMeaningDialectCSV,
    'output/csv/word_meaning_x_dial.csv'
  );
  await writeCSVFile(wordTranslationCSV, 'output/csv/word_translation.csv');
  await writeCSVFile(wordMeaningInfoCSV, 'output/csv/word_meaning_info.csv');
  await writeCSVFile(
    wordMeaningRestrictionCSV,
    'output/csv/word_meaning_restriction.csv'
  );
  await writeCSVFile(
    wordMeaningSummaryCSV,
    'output/csv/word_meaning_summary.csv'
  );
};
