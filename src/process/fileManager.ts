import { readJsonFile } from 'src/utils';

import type { Radical } from 'src/type/tkdb';
import type { JMdict } from 'src/type/jmdict';
import type { Kanjidic2 } from 'src/type/kanjidic2';
import type { KanjiumAntonym } from 'src/type/kanjium_antonym';
import type { KanjiumFrequency } from 'src/type/kanjium_frequency';
import type { KanjiumLookalike } from 'src/type/kanjium_lookalike';
import type { KanjiumSynonym } from 'src/type/kanjium_synonym';
import type { Kradfilex } from 'src/type/kradfilex';
import type { TanosKanji } from 'src/type/tanos_kanji';
import type { TanosVocab } from 'src/type/tanos_vocab';
import type { Wordfreq } from 'src/type/wordfreq_ck';
import type { KVG } from 'src/type/kanjivg';
import type { JMdictFurigana } from 'src/type/jmdict_furigana';

class FileManager {
  private tanosVocabs: TanosVocab[] | null = null;
  private jmdict: JMdict | null = null;
  private wordfreqs: Wordfreq[] | null = null;
  private kanjidic2: Kanjidic2 | null = null;
  private tanosKanjis: TanosKanji[] | null = null;
  private kanjiumAntonyms: KanjiumAntonym[] | null = null;
  private kanjiumLookalikes: KanjiumLookalike[] | null = null;
  private kanjiumSynonyms: KanjiumSynonym[] | null = null;
  private kanjiumFrequencies: KanjiumFrequency[] | null = null;
  private kradfilex: Kradfilex[] | null = null;
  private tkdbRadicals: Radical[] | null = null;
  private kanjivg: KVG | null = null;
  private jmdictFurigana: JMdictFurigana[] | null = null;

  public async loadFiles(): Promise<void> {
    try {
      const [
        tanosVocabs,
        jmdict,
        wordfreqs,
        kanjidic2,
        tanosKanjis,
        kanjiumAntonyms,
        kanjiumLookalikes,
        kanjiumSynonyms,
        kanjiumFrequencies,
        kradfilex,
        tkdbRadicals,
        kanjivg,
        jmdictFurigana,
      ] = await Promise.all([
        readJsonFile<TanosVocab[]>('input/tanos_vocab.json'),
        readJsonFile<JMdict>('input/converted/jmdict.json'),
        readJsonFile<Wordfreq[]>('input/converted/wordfreq_ck.json'),
        readJsonFile<Kanjidic2>('input/converted/kanjidic2.json'),
        readJsonFile<TanosKanji[]>('input/tanos_kanji.json'),
        readJsonFile<KanjiumAntonym[]>('input/kanjium_antonyms.json'),
        readJsonFile<KanjiumLookalike[]>('input/kanjium_lookalikes.json'),
        readJsonFile<KanjiumSynonym[]>('input/kanjium_synonyms.json'),
        readJsonFile<KanjiumFrequency[]>('input/kanjium_frequency.json'),
        readJsonFile<Kradfilex[]>('input/converted/kradfilex.json'),
        readJsonFile<Radical[]>('input/tkdb_radicals.json'),
        readJsonFile<KVG>('input/converted/kanjivg.json'),
        readJsonFile<JMdictFurigana[]>('input/download/jmdict_furigana.json'),
      ]);

      this.tanosVocabs = tanosVocabs;
      this.jmdict = jmdict;
      this.wordfreqs = wordfreqs;
      this.kanjidic2 = kanjidic2;
      this.tanosKanjis = tanosKanjis;
      this.kanjiumAntonyms = kanjiumAntonyms;
      this.kanjiumLookalikes = kanjiumLookalikes;
      this.kanjiumSynonyms = kanjiumSynonyms;
      this.kanjiumFrequencies = kanjiumFrequencies;
      this.kradfilex = kradfilex;
      this.tkdbRadicals = tkdbRadicals;
      this.kanjivg = kanjivg;
      this.jmdictFurigana = jmdictFurigana;
    } catch (error) {
      throw new Error(`Failed to load files`);
    }
  }

  public getTanosVocabs(): TanosVocab[] {
    if (this.tanosVocabs === null) {
      throw new Error('Tanos vocabulary data is not set.');
    }
    return this.tanosVocabs;
  }

  public getJMdict(): JMdict {
    if (this.jmdict === null) {
      throw new Error('JMdict data is not set.');
    }
    return this.jmdict;
  }

  public getWordfreqs(): Wordfreq[] {
    if (this.wordfreqs === null) {
      throw new Error('Wordfreq data is not set.');
    }
    return this.wordfreqs;
  }

  public setWordfreqs(wordfreqs: Wordfreq[]): void {
    this.wordfreqs = wordfreqs;
  }

  public getKanjidic2(): Kanjidic2 {
    if (this.kanjidic2 === null) {
      throw new Error('Kanjidic2 data is not set.');
    }
    return this.kanjidic2;
  }

  public setKanjidic2(kanjidic2: Kanjidic2): void {
    this.kanjidic2 = kanjidic2;
  }

  public getTanosKanjis(): TanosKanji[] {
    if (this.tanosKanjis === null) {
      throw new Error('Tanos Kanji data is not set.');
    }
    return this.tanosKanjis;
  }

  public getKanjiumAntonyms(): KanjiumAntonym[] {
    if (this.kanjiumAntonyms === null) {
      throw new Error('Kanjium antonym data is not set.');
    }
    return this.kanjiumAntonyms;
  }

  public getKanjiumLookalikes(): KanjiumLookalike[] {
    if (this.kanjiumLookalikes === null) {
      throw new Error('Kanjium lookalike data is not set.');
    }
    return this.kanjiumLookalikes;
  }

  public getKanjiumSynonyms(): KanjiumSynonym[] {
    if (this.kanjiumSynonyms === null) {
      throw new Error('Kanjium synonym data is not set.');
    }
    return this.kanjiumSynonyms;
  }

  public getKanjiumFrequencies(): KanjiumFrequency[] {
    if (this.kanjiumFrequencies === null) {
      throw new Error('Kanjium frequency data is not set.');
    }
    return this.kanjiumFrequencies;
  }

  public getKradfilex(): Kradfilex[] {
    if (this.kradfilex === null) {
      throw new Error('Kradfilex data is not set.');
    }
    return this.kradfilex;
  }

  public getTKDBradicals(): Radical[] {
    if (this.tkdbRadicals === null) {
      throw new Error('TKDB radical data is not set.');
    }
    return this.tkdbRadicals;
  }

  public getKanjivg(): KVG {
    if (this.kanjivg === null) {
      throw new Error('KanjiVG data is not set.');
    }
    return this.kanjivg;
  }

  public getJmdictFurigana(): JMdictFurigana[] {
    if (this.jmdictFurigana === null) {
      throw new Error('JMdict furigana data is not set.');
    }
    return this.jmdictFurigana;
  }
}

export const fileManager = new FileManager();
