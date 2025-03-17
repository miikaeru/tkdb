import type {
  WordLanguageSource,
  WordSenseDial,
  WordSenseField,
  WordSenseMisc,
  WordSensePos,
  WordSense,
  WordGloss,
} from 'tkdb-helper';

import type {
  JMdictEntr,
  JMdictSensDial,
  JMdictSensField,
  JMdictSensLSrc,
  JMdictSensMisc,
  JMdictSensPos,
} from '../../type/jmdict';

import {toArray, toArrayOrUndefined, toHash} from '../../utils';
import {setManager} from '../setManager';
import createGlosses from './createGlosses';

interface Form {
  kana: string;
  kanji?: string | undefined;
}

export default (jmEntry: JMdictEntr, form?: Form): WordSense[] => {
  const senses: WordSense[] = [];

  const jmSenses = toArray(jmEntry.sense);

  for (const jmSense of jmSenses) {
    const {gloss, pos, field, dial, misc, s_inf, lsource, stagk, stagr} =
      jmSense;

    const jmKanaRestrictions = toArrayOrUndefined(stagr);
    const jmKanjiRestrictions = toArrayOrUndefined(stagk);

    // If form is provided, create only meanings that are restricted to the form
    if (form) {
      const {kana, kanji} = form;

      // This meaning is restricted, but not for this kana
      const isKanaRestricted =
        jmKanaRestrictions && !jmKanaRestrictions.includes(kana);

      // This meaning is restricted, but not for this kanji
      const isKanjiRestricted =
        kanji && jmKanjiRestrictions && !jmKanjiRestrictions.includes(kanji);

      // Skip this meaning
      if (isKanaRestricted || isKanjiRestricted) {
        continue;
      }
    }

    const jmGloss = toArray(gloss);
    const jmPartsOfSpeech = toArrayOrUndefined(pos);
    const jmFields = toArrayOrUndefined(field);
    const jmDialects = toArrayOrUndefined(dial);
    const jmMiscs = toArrayOrUndefined(misc);
    const jmSenseInfo = s_inf;
    const jmLsources = toArrayOrUndefined(lsource);

    const restrictions = getRestrictions(
      jmKanaRestrictions,
      jmKanjiRestrictions
    );

    const glosses = createGlosses(jmGloss);

    const posCategories = getPosCategories(jmPartsOfSpeech);
    const fieldCategories = getFieldCategories(jmFields);
    const dialectCategories = getDialectCategories(jmDialects);
    const miscCategories = getMiscCategories(jmMiscs);
    let categories: string[] | undefined;
    categories = [
      ...(posCategories ?? []),
      ...(fieldCategories ?? []),
      ...(dialectCategories ?? []),
      ...(miscCategories ?? []),
    ];
    categories = categories.length > 0 ? categories : undefined;

    const informations = getInformations(jmSenseInfo);
    const languageSources = getLanguageSources(jmLsources);

    const id = getId(categories, glosses, informations);

    senses.push({
      id,
      restrictions,
      glosses,
      posCategories,
      fieldCategories,
      dialectCategories,
      miscCategories,
      informations,
      languageSources,
    });
  }

  return senses;
};

const getId = (
  categories: string[] | undefined,
  glosses: WordGloss[],
  informations: string[] | undefined
): string => {
  const flattedTranslations = glosses.flatMap(gloss => {
    const orderedValues: string[] = [];
    if (gloss.type) orderedValues.push(gloss.type); // Push `type` first if it exists
    orderedValues.push(gloss.definition);
    return orderedValues;
  });

  let hashable = '';

  hashable += categories?.sort().join();
  hashable += flattedTranslations.join();
  hashable += informations?.join();

  return toHash(hashable);
};

const getPosCategories = (
  jmPartsOfSpeech: JMdictSensPos[] | undefined
): WordSensePos[] | undefined => {
  jmPartsOfSpeech?.forEach(pos => {
    setManager.wordSensePos.add(pos);
  });

  return jmPartsOfSpeech;
};

const getRestrictions = (
  jmKanaRestrictions: string[] | undefined,
  jmKanjiRestrictions: string[] | undefined
): string[] | undefined => {
  const restrictions = [
    ...(jmKanaRestrictions ?? []),
    ...(jmKanjiRestrictions ?? []),
  ];
  if (restrictions.length === 0) {
    return undefined;
  }
  return restrictions;
};

const getFieldCategories = (
  jmFields: JMdictSensField[] | undefined
): WordSenseField[] | undefined => {
  jmFields?.forEach(field => {
    setManager.wordSenseField.add(field);
  });
  return jmFields;
};

const getDialectCategories = (
  jmDialects: JMdictSensDial[] | undefined
): WordSenseDial[] | undefined => {
  jmDialects?.forEach(dial => {
    setManager.wordSenseDial.add(dial);
  });
  return jmDialects;
};

const getMiscCategories = (
  jmMiscs: JMdictSensMisc[] | undefined
): WordSenseMisc[] | undefined => {
  jmMiscs?.forEach(misc => {
    setManager.wordSenseMisc.add(misc);
  });
  return jmMiscs;
};

const getInformations = (
  jmSenseInfos: string | undefined
): string[] | undefined => {
  return jmSenseInfos?.split(';');
};

const getLanguageSources = (
  jmLsources: JMdictSensLSrc[] | undefined
): WordLanguageSource[] | undefined => {
  const languageSources: WordLanguageSource[] = [];

  if (jmLsources === undefined) return undefined;

  for (const jmLsource of jmLsources) {
    const description = jmLsource.value;
    const language = jmLsource.lang ?? 'eng';
    const waseieigo = jmLsource.ls_wasei !== undefined ? true : undefined;
    const part = jmLsource.ls_type !== undefined ? true : undefined;

    languageSources.push({
      description,
      language,
      waseieigo,
      part,
    });
  }

  if (languageSources.length < 1) return undefined;

  return languageSources;
};
