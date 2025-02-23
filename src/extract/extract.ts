import {fileManager} from '../process/fileManager';
import {toArray, toArrayOrUndefined} from '../utils';
import {bold} from 'chalk';

export default async (): Promise<void> => {
  await fileManager.loadFiles();
  const kanjidic2 = fileManager.getKanjidic2();
  const jmdict = fileManager.getJMdict();

  const gradeSet = new Set<string>();
  const jlptSet = new Set<string>();
  const dialSet = new Set<string>();
  const miscSet = new Set<string>();
  const fieldSet = new Set<string>();
  const posSet = new Set<string>();
  const reInfo = new Set<string>();
  const keInfo = new Set<string>();
  const glossType = new Set<string>();

  // Loop through all characters in kanjidic2 and extract grade and JLPT levels
  for (const kd2Character of kanjidic2.character) {
    const grade = kd2Character.misc.grade;
    const jlpt = kd2Character.misc.jlpt;

    if (grade !== undefined) {
      gradeSet.add(grade);
    }

    if (jlpt !== undefined) {
      jlptSet.add(jlpt);
    }
  }

  // Loop through all entries in JMdict and extract dial, misc, field, pos, re_info, and ke_info categories
  for (const entry of jmdict.entry) {
    const jmSenses = toArray(entry.sense);
    const jmReles = toArray(entry.r_ele);
    const jmKeles = toArrayOrUndefined(entry.k_ele);

    for (const jmSense of jmSenses) {
      const jmDials = toArrayOrUndefined(jmSense.dial);
      jmDials?.forEach(dial => {
        dialSet.add(dial);
      });

      const jmMiscs = toArrayOrUndefined(jmSense.misc);
      jmMiscs?.forEach(misc => {
        miscSet.add(misc);
      });

      const jmFields = toArrayOrUndefined(jmSense.field);
      jmFields?.forEach(field => {
        fieldSet.add(field);
      });

      const jmPos = toArrayOrUndefined(jmSense.pos);
      jmPos?.forEach(pos => {
        posSet.add(pos);
      });

      const jmGloss = toArray(jmSense.gloss);
      for (const jmGlossEntry of jmGloss) {
        if (typeof jmGlossEntry === 'string') {
          continue;
        }
        const jmGlossType = jmGlossEntry.g_type;
        if (jmGlossType) {
          glossType.add(jmGlossType);
        }
      }
    }

    for (const jmRele of jmReles) {
      const jmReInfo = toArrayOrUndefined(jmRele.re_inf);
      jmReInfo?.forEach(re => {
        reInfo.add(re);
      });
    }

    if (jmKeles) {
      for (const jmKele of jmKeles) {
        const jmKeInfo = toArrayOrUndefined(jmKele.ke_inf);
        jmKeInfo?.forEach(ke => {
          keInfo.add(ke);
        });
      }
    }
  }

  const logCategories = (title: string, set: Set<string>) => {
    const categories = Array.from(set).sort().join("'|'");
    console.log(bold(title));
    console.log(`'${categories}'`);
    console.log(''); // Add an empty line between logging categories
  };

  logCategories('Kanjidic2 grade categories', gradeSet);
  logCategories('Kanjidic2 JLPT categories', jlptSet);
  logCategories('JMdict dial categories', dialSet);
  logCategories('JMdict misc categories', miscSet);
  logCategories('JMdict field categories', fieldSet);
  logCategories('JMdict pos categories', posSet);
  logCategories('JMdict re_info categories', reInfo);
  logCategories('JMdict ke_info categories', keInfo);
  logCategories('JMdict gloss_type categories', glossType);
};
