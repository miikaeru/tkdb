import {Presets, SingleBar} from 'cli-progress';
import type {Options} from 'cli-progress';
import type {Word} from 'tkdb-helper';

import {fileManager} from '../../process/fileManager';
import createForms from './createForms';
import createSearchWords from './createSearchWords';

import createPrimaryGlosses from './createPrimaryGlosses';
import createSenses from './createSenses';

export default (): Word[] => {
  const jmdict = fileManager.getJMdict();
  const jmEntries = jmdict.entry;

  const words: Word[] = [];

  const progressBarOptions: Options = {
    hideCursor: true,
    format: '{bar} {percentage}% | {value}/{total} words',
  };
  const bar = new SingleBar(progressBarOptions, Presets.shades_classic);
  bar.start(jmEntries.length, 0);

  for (const jmEntry of jmEntries) {
    const id = +jmEntry.ent_seq;
    const forms = createForms(jmEntry);
    const senses = createSenses(jmEntry);
    const primaryGlosses = createPrimaryGlosses(jmEntry);
    const searchWords = createSearchWords(jmEntry);

    words.push({
      id,
      forms,
      senses,
      primaryGlosses,
      searchWords,
    });

    bar.increment();
  }

  bar.stop();
  return words;
};
