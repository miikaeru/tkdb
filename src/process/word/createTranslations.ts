import {WordMeaningTranslation} from 'tkdb-helper';
import {JMdictSensGloss} from '../../type/jmdict';
import {setManager} from '../setManager';

export default (
  gloss: Array<string | JMdictSensGloss>
): WordMeaningTranslation[] => {
  const translations: WordMeaningTranslation[] = [];

  for (const entry of gloss) {
    if (typeof entry === 'string') {
      const text = entry;
      translations.push({text});
    } else {
      const type = entry.g_type;
      const text = entry.value;

      if (type) {
        setManager.wordTranslationType.add(type);
      }

      // TODO: Implement other languages
      // const isEnglish = entry.lang === undefined;
      // if (isEnglish) {
      // }

      translations.push({text, type});
    }
  }

  if (translations.length < 1) {
    throw new Error('Translation array can not be empty');
  }

  return translations;
};
