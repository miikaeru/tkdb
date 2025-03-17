import type {WordGloss} from 'tkdb-helper';

import type {JMdictEntr} from '../../type/jmdict';
import {toArray} from '../../utils';
import createGlosses from './createGlosses';

export default (jmEntry: JMdictEntr): WordGloss[] => {
  const primaryGlosses: WordGloss[] = [];

  const jmSenses = toArray(jmEntry.sense);

  for (const jmSense of jmSenses) {
    const {gloss} = jmSense;

    const jmGloss = toArray(gloss);

    const glosses = createGlosses(jmGloss).slice(0, 3);

    glosses.forEach(gloss => {
      if (glosses.length < 9) {
        const definition = removeParenthesesIfTextRemains(gloss.definition);
        const type = gloss.type;

        primaryGlosses.push({definition, type});
      }
    });
  }

  return primaryGlosses;
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
