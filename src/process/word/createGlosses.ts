import {WordGloss} from 'tkdb-helper';
import {JMdictSensGloss} from '../../type/jmdict';
import {setManager} from '../setManager';

export default (jmGlosses: Array<string | JMdictSensGloss>): WordGloss[] => {
  const glosses: WordGloss[] = [];

  for (const jmGloss of jmGlosses) {
    if (typeof jmGloss === 'string') {
      const definition = jmGloss;
      glosses.push({definition});
    } else {
      const type = jmGloss.g_type;
      const definition = jmGloss.value;

      if (type) {
        setManager.wordGlossType.add(type);
      }

      // TODO: Implement other languages
      // const isEnglish = entry.lang === undefined;
      // if (isEnglish) {
      // }

      glosses.push({definition, type});
    }
  }

  if (glosses.length < 1) {
    throw new Error('Translation array can not be empty');
  }

  return glosses;
};
