import {setIncludesExactRecordKeys, writeJsonFile} from '../utils';
import {fileManager} from '../process/fileManager';
import createKanjis from '../process/kanji/createKanjis';
import createWords from '../process/word/createWords';
import createRadicals from '../process/radical/createRadicals';

import {CATEGORIES, type TKDB, type Word} from 'tkdb-helper';
import {green} from 'chalk';
import {setManager} from './setManager';

export default async (): Promise<void> => {
  const dateOfCreation = new Date();
  const dateInSeconds = Math.round(dateOfCreation.getTime() / 1000);
  const version = dateInSeconds.toString();

  console.log('Processing files …');

  await fileManager.loadFiles();

  const categories = CATEGORIES;
  const radicals = createRadicals();
  const kanjis = createKanjis();
  const words: Word[] = createWords();

  const tkdb: TKDB = {
    dateOfCreation,
    version,
    categories,
    radicals,
    kanjis,
    words,
  };

  compareCategories();

  await writeJsonFile(tkdb, 'output/tkdb.json');

  console.log(green('All files processed'));
};

const compareCategories = (): void => {
  const categoriesToCompare = [
    {
      set: setManager.wordFormInfo,
      category: CATEGORIES.wordFormInfo,
      name: 'Word Form Info',
    },
    {
      set: setManager.wordMeaningPos,
      category: CATEGORIES.wordMeaningPos,
      name: 'Word Meaning POS',
    },
    {
      set: setManager.wordMeaningField,
      category: CATEGORIES.wordMeaningField,
      name: 'Word Meaning Field',
    },
    {
      set: setManager.wordMeaningMisc,
      category: CATEGORIES.wordMeaningMisc,
      name: 'Word Meaning Misc',
    },
    {
      set: setManager.wordMeaningDial,
      category: CATEGORIES.wordMeaningDial,
      name: 'Word Meaning Dial',
    },
    {
      set: setManager.wordTranslationType,
      category: CATEGORIES.wordTranslationType,
      name: 'Word Translation Type',
    },
  ];

  categoriesToCompare.forEach(({set, category, name}) => {
    setIncludesExactRecordKeys(set, category, name);
  });
};
