import type {WordMeaningTranslation} from 'tkdb-helper';

import type {JMdictEntr} from '../../type/jmdict';
import {toArray} from '../../utils';
import createTranslations from './createTranslations';

export default (jmEntry: JMdictEntr): WordMeaningTranslation[] => {
  const meanings: WordMeaningTranslation[] = [];

  const jmSenses = toArray(jmEntry.sense);

  for (const jmSense of jmSenses) {
    const {gloss} = jmSense;

    const jmGloss = toArray(gloss);

    const translations = createTranslations(jmGloss).slice(0, 3);

    translations.forEach(translation => {
      if (meanings.length < 9) {
        const text = removeParenthesesIfTextRemains(translation.text);
        const type = translation.type;

        meanings.push({text, type});
      }
    });
  }

  return meanings;
};

const removeNestedParentheses = (input: string): string => {
  let previous = '';
  let current = input;

  // Repeatedly remove the innermost parentheses until none remain
  while (previous !== current) {
    previous = current;
    current = current.replace(/\([^()]*\)/g, '');
  }

  return current.trim();
};

const removeParenthesesIfTextRemains = (input: string): string => {
  const stripped = removeNestedParentheses(input);
  return stripped.length > 0 ? stripped : '';
};
