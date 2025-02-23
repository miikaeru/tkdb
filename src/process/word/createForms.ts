import {JLPT, WordForm, WordFurigana} from 'tkdb-helper';
import {
  JMdictEntr,
  JMdictKanji,
  JMdictRdng,
  JMdictRdngInf,
  JMdictSens,
} from '../../type/jmdict';
import {toArray, toArrayOrUndefined, toHash} from '../../utils';
import {isKanji, toRomaji} from 'wanakana';

import {fileManager} from '../fileManager';
import {setManager} from '../setManager';
import createMeanings from './createMeanings';

interface Form {
  kana: string;
  kanji?: string;
}

export default (jmEntry: JMdictEntr): WordForm[] => {
  const {r_ele, sense, k_ele, ent_seq} = jmEntry;
  const jmId = ent_seq;
  const jmReles = toArray(r_ele);
  const jmKeles = toArrayOrUndefined(k_ele);
  const jmSenses = toArray(sense);

  const wordNeedsKanaForm = hasSenseWithKanaForm(jmSenses);

  const formCombinations = createFormCombinations(
    jmReles,
    jmKeles,
    wordNeedsKanaForm
  );

  if (!wordNeedsKanaForm) {
    formCombinations.sort(sortKanaFormsToEnd);
  }

  const forms: WordForm[] = [];
  // Loop through all form combinations and populate word forms
  for (const formCombination of formCombinations) {
    const {kana, kanji} = formCombination;

    const jmRele = jmReles.find(r => r.reb === kana);
    const jmKele = jmKeles?.find(k => k.keb === kanji);

    // jmRele can not be undefined
    if (jmRele === undefined) {
      throw new Error(`jmRele not fount for ${jmId} ${kana}`);
    }

    const jmKeInfo = toArrayOrUndefined(jmKele?.ke_inf);
    const jmReInfo = toArrayOrUndefined(jmRele?.re_inf);

    const jmRePriorities = toArrayOrUndefined(jmRele?.re_pri);
    const jmKePriorities = toArrayOrUndefined(jmKele?.ke_pri);
    const jmPriorities = [...(jmKePriorities ?? []), ...(jmRePriorities ?? [])];

    const wordId = +jmId;
    const id = toHash(jmId + kana + kanji);

    // Create combined info and turn to set to prevent duplicates
    const informations =
      jmReInfo || jmKeInfo
        ? [...new Set([...(jmReInfo ?? []), ...(jmKeInfo ?? [])])]
        : undefined;

    informations?.forEach(entry => setManager.wordFormInfo.add(entry));

    const unusual =
      informations?.includes('oK') ||
      informations?.includes('ok') ||
      informations?.includes('iK') ||
      informations?.includes('ik') ||
      informations?.includes('io') ||
      informations?.includes('ik') ||
      informations?.includes('rK') ||
      informations?.includes('rk') ||
      undefined;

    const romaji = toRomaji(kana);

    // Do not set common and frequency if the form is unusual
    const common = unusual ? undefined : isCommon(jmPriorities);
    const frequency = unusual ? undefined : getFrequency(jmPriorities);

    const jlpt = getJlpt(formCombination, jmId);
    const furigana = getFurigana(formCombination);
    const usedKanji = extractKanji(kanji);

    const meanings = createMeanings(jmEntry, {kana, kanji});

    forms.push({
      wordId,
      id,
      kana,
      kanji,
      romaji,
      common,
      frequency,
      jlpt,
      furigana,
      usedKanji,
      unusual,
      informations,
      meanings,
    });
  }

  // Sort forms
  forms.sort(sortUnusualForms);

  return forms;
};

export const createFormCombinations = (
  jmReles: JMdictRdng[],
  jmKeles: JMdictKanji[] | undefined,
  needsKanaForm: boolean
): Form[] => {
  // Map to prevent duplicate form. Key represents a form.
  const forms = new Map<string, Form>();

  // Filter kana and kanji elements from search-only forms
  const filteredJmReles = jmReles.filter(
    element => !toArrayOrUndefined(element.re_inf)?.includes('sk')
  );
  const filteredJmKeles = jmKeles?.filter(
    element => !toArrayOrUndefined(element.ke_inf)?.includes('sK')
  );

  // 1. Only kana forms
  if (filteredJmKeles === undefined) {
    filteredJmReles.forEach(element => {
      const kana = element.reb;
      forms.set(kana, {kana});
    });
  } else {
    // 2. Needs kana form
    if (needsKanaForm) {
      filteredJmReles.forEach(element => {
        const kana = element.reb;

        // Only add kana forms that are not unusual
        const infos = toArrayOrUndefined(element.re_inf);
        const unusualInfo: JMdictRdngInf[] = ['ik', 'ok', 'rk'];
        const isUnusualKana = infos?.some(info => unusualInfo.includes(info));
        if (!isUnusualKana) forms.set(kana, {kana});
      });
    }

    // 3. Kana readings with no kanji
    const noKanjiJmReles = filteredJmReles.filter(
      rele => rele.re_nokanji !== undefined
    );
    noKanjiJmReles.forEach(rele => {
      const kana = rele.reb;
      forms.set(kana, {kana});
    });

    // 4. Kanji forms with associated kana readings
    const kanjiJmReles = filteredJmReles.filter(
      rele => rele.re_nokanji === undefined
    );
    filteredJmKeles.forEach(kele => {
      kanjiJmReles.forEach(rele => {
        const kanji = kele.keb;
        const kana = rele.reb;
        const readingRestrictions = toArrayOrUndefined(rele.re_restr);

        // Do no set the form if it has restrictions that are not matching
        if (!readingRestrictions || readingRestrictions.includes(kanji)) {
          forms.set(kanji + kana, {kanji, kana});
        }
      });
    });
  }

  return Array.from(forms.values());
};

export const hasSenseWithKanaForm = (jmSenses: JMdictSens[]): boolean => {
  return jmSenses.some(jmSense => {
    const jmMiscs = toArrayOrUndefined(jmSense.misc);
    return jmMiscs?.includes('uk');
  });
};

const getJlpt = (form: Form, id: string): JLPT | undefined => {
  const {kana, kanji} = form;

  const tanosVocabMap = fileManager.getTanosVocabMap();

  const lookupKey = [id, kanji, kana].join(':');
  const match = tanosVocabMap.get(lookupKey);

  return match?.jlpt;
};

const getFurigana = (form: Form): WordFurigana[] | undefined => {
  const {kana, kanji} = form;

  // Fugiana must have a kanji
  if (kanji === undefined) return undefined;

  const jmdictFuriganaMap = fileManager.getJmdictFuriganaMap();
  const match = jmdictFuriganaMap.get(`${kanji}:${kana}`);

  if (match === undefined) return undefined;

  const furigana: WordFurigana[] = [];

  for (const f of match.furigana) {
    const ruby = f.ruby;
    const rt = f.rt;

    furigana.push({ruby, rt});
  }

  return furigana.length > 0 ? furigana : undefined;
};

export const extractKanji = (
  input: string | undefined
): string[] | undefined => {
  if (input === undefined) return undefined;

  const uniqueKanjiSet = new Set<string>();
  const characters = Array.from(input);
  const kanjiArray = characters.filter(isKanji);

  kanjiArray.forEach(kanji => {
    uniqueKanjiSet.add(kanji);
  });

  const uniqueKanjiArray = Array.from(uniqueKanjiSet);

  if (uniqueKanjiArray.length < 1) return;

  return uniqueKanjiArray;
};

export const isCommon = (priorities?: string[]): boolean | undefined => {
  if (priorities === undefined) return undefined;

  for (const priority of priorities) {
    if (priority.startsWith('nf')) {
      return true;
    } else if (priority === 'spec1') {
      return true;
    } else if (priority === 'ichi1') {
      return true;
    }
  }
  return undefined;
};

export const getFrequency = (priorities?: string[]): number | undefined => {
  if (priorities === undefined) return undefined;

  // TODO: what about words that only have ICHI1 for example?
  for (const priority of priorities) {
    if (priority.startsWith('nf')) {
      return extractNfxx(priority);
    }
  }

  return undefined;
};

export const extractNfxx = (priority: string): number => {
  // Check if the input starts with "nf" and has at least 4 characters (e.g., "nf00")
  if (priority.startsWith('nf') && priority.length >= 4) {
    // Extract the substring from the 3rd to the 4th character (inclusive)
    const numberPart = priority.substring(2, 4);
    // Convert the extracted substring to a number
    const result = parseInt(numberPart, 10);
    // Return the resulting number
    return result;
  } else {
    // If the priority is invalid, throw an error
    throw new Error(
      "Invalid priority format. Expected format is 'nfXX' where XX are two digits."
    );
  }
};

// Sort kana forms to the end
export const sortKanaFormsToEnd = (a: Form, b: Form): number => {
  const aHasKanji = 'kanji' in a;
  const bHasKanji = 'kanji' in b;

  if (aHasKanji && !bHasKanji) {
    return -1; // a has kanji, b does not, so a should come first
  }

  if (!aHasKanji && bHasKanji) {
    return 1; // b has kanji, a does not, so b should come first
  }

  return 0; // both have or don't have kanji, maintain their relative order
};

// Sort unusual forms to the end
const sortUnusualForms = (a: WordForm, b: WordForm): number => {
  const aUnusual = a.unusual;
  const bUnusual = b.unusual;
  if (aUnusual && !bUnusual) return 1; // Move `a` to the end
  if (!aUnusual && bUnusual) return -1; // Move `b` to the end
  return 0; // No change
};
