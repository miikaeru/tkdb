// Documentation
// https://www.edrdg.org/jmdict/jmdict_dtd_h.html

export interface JMdict {
  entry: JMdictEntr[];
}

export interface JMdictEntr {
  ent_seq: string;
  k_ele?: JMdictKanji | JMdictKanji[];
  r_ele: JMdictRdng | JMdictRdng[];
  sense: JMdictSens | JMdictSens[];
}

export interface JMdictKanji {
  keb: string;
  ke_inf?: JMdictKanjiInf | JMdictKanjiInf[];
  ke_pri?: string | string[];
}

export interface JMdictRdng {
  reb: string;
  re_nokanji?: string;
  re_restr?: string | string[];
  re_inf?: JMdictRdngInf | JMdictRdngInf[];
  re_pri?: string | string[];
}

export interface JMdictSens {
  pos?: JMdictSensPos | JMdictSensPos[];
  field?: JMdictSensField | JMdictSensField[];
  misc?: JMdictSensMisc | JMdictSensMisc[];
  lsource?: JMdictSensLSrc | JMdictSensLSrc[];
  dial?: JMdictSensDial | JMdictSensDial[];
  gloss: string | JMdictSensGloss | Array<string | JMdictSensGloss>;

  /**
   * These elements, if present, indicate that the sense is restricted to the lexeme represented by the keb.
   */
  stagk?: string | string[];

  /**
   * These elements, if present, indicate that the sense is restricted to the lexeme represented by the reb.
   */
  stagr?: string | string[];

  /**
   * This element is used to indicate another entry which is an antonym of the current entry/sense.
   * The content of this element must exactly match that of a keb or reb element in another entry.
   */
  ant?: string | string[];

  /**
   * This element is used to indicate a cross-reference to another entry with a similar or related meaning or sense.
   * This element is typically a keb or reb element in another entry.
   * In some cases a keb will be followed by a reb and/or a sense number to provide a precise target for the cross-reference.
   * Where this happens, a JIS "centre-dot" (0x2126) is placed between the components of the cross-reference.
   */
  xref?: string | string[];

  /**
   * The sense-information elements provided for additional information to be recorded about a sense.
   * Typical usage would be to indicate such things as level of currency of a sense, the regional variations, etc.
   */
  s_inf?: string;
}

/**
 * This element records the information about the source language(s) of a loan-word/gairaigo.
 * If the source language is other than English, the language is indicated by the xml:lang attribute.
 * The element value (if any) is the source word or phrase.
 */
export interface JMdictSensLSrc {
  value: string;

  /**
   * The xml:lang attribute defines the language(s) from which a loanword is drawn.
   * It will be coded using the three-letter language code from the ISO 639-2 standard.
   * When absent, the value "eng" (i.e. English) is the default value.
   * The bibliographic (B) codes are used.
   */
  lang?: JMdictSensLSourceLang;

  /**
   * The ls_type attribute indicates whether the lsource element fully or partially describes the source word or phrase of the loanword.
   * If absent, it will have the implied value of "full".
   * Otherwise it will contain "part".
   */
  ls_type?: 'part';

  /**
   * The ls_wasei attribute indicates that the Japanese word has been constructed from words in the source language,
   * and not from an actual phrase in that language.
   * Most commonly used to indicate "waseieigo".
   */
  ls_wasei?: 'y';
}

export interface JMdictSensGloss {
  value: string;
  lang?: JMdictSensGlossLang;
  g_type: JMdictSensGlossType | undefined;
}

export type JMdictKanjiInf = 'ateji' | 'iK' | 'ik' | 'io' | 'oK' | 'rK' | 'sK';

export type JMdictRdngInf = 'gikun' | 'ik' | 'ok' | 'rk' | 'sk';

export type JMdictSensGlossLang =
  | 'dut'
  | 'ger'
  | 'rus'
  | 'spa'
  | 'hun'
  | 'swe'
  | 'fre'
  | 'slv';

export type JMdictSensGlossType = 'expl' | 'lit' | 'tm' | 'fig';

/**
 * For words specifically associated with regional dialects in Japanese, the entity code for that dialect, e.g. ksb for Kansaiben.
 */
export type JMdictSensDial =
  | 'bra'
  | 'hob'
  | 'ksb'
  | 'ktb'
  | 'kyb'
  | 'kyu'
  | 'nab'
  | 'osb'
  | 'rkb'
  | 'thb'
  | 'tsb'
  | 'tsug';

/**
 * Part-of-speech information about the entry/sense.
 * Should use appropriate entity codes.
 * In general where there are multiple senses in an entry, the part-of-speech of an earlier sense will apply to later senses unless there is a new part-of-speech indicated.
 */
export type JMdictSensPos =
  | 'adjF'
  | 'adjI'
  | 'adjIx'
  | 'adjKu'
  | 'adjNa'
  | 'adjNari'
  | 'adjNo'
  | 'adjPn'
  | 'adjShiku'
  | 'adjT'
  | 'adv'
  | 'advTo'
  | 'aux'
  | 'auxAdj'
  | 'auxV'
  | 'conj'
  | 'cop'
  | 'ctr'
  | 'exp'
  | 'int'
  | 'n'
  | 'nPref'
  | 'nSuf'
  | 'num'
  | 'pn'
  | 'pref'
  | 'prt'
  | 'suf'
  | 'unc'
  | 'v1'
  | 'v1S'
  | 'v2aS'
  | 'v2bK'
  | 'v2dS'
  | 'v2gK'
  | 'v2gS'
  | 'v2hK'
  | 'v2hS'
  | 'v2kK'
  | 'v2kS'
  | 'v2mS'
  | 'v2nS'
  | 'v2rK'
  | 'v2rS'
  | 'v2sS'
  | 'v2tK'
  | 'v2tS'
  | 'v2wS'
  | 'v2yK'
  | 'v2yS'
  | 'v2zS'
  | 'v4b'
  | 'v4g'
  | 'v4h'
  | 'v4k'
  | 'v4m'
  | 'v4r'
  | 'v4s'
  | 'v4t'
  | 'v5aru'
  | 'v5b'
  | 'v5g'
  | 'v5k'
  | 'v5kS'
  | 'v5m'
  | 'v5n'
  | 'v5r'
  | 'v5rI'
  | 'v5s'
  | 'v5t'
  | 'v5u'
  | 'v5uS'
  | 'vi'
  | 'vk'
  | 'vn'
  | 'vr'
  | 'vs'
  | 'vsC'
  | 'vsI'
  | 'vsS'
  | 'vt'
  | 'vz';

/**
 * Information about the field of application of the entry/sense.
 * When absent, general application is implied.
 * Entity coding for specific fields of application.
 */
export type JMdictSensField =
  | 'agric'
  | 'anat'
  | 'archeol'
  | 'archit'
  | 'art'
  | 'astron'
  | 'audvid'
  | 'aviat'
  | 'baseb'
  | 'biochem'
  | 'biol'
  | 'bot'
  | 'boxing'
  | 'buddh'
  | 'bus'
  | 'cards'
  | 'chem'
  | 'chmyth'
  | 'christn'
  | 'civeng'
  | 'cloth'
  | 'comp'
  | 'cryst'
  | 'dent'
  | 'ecol'
  | 'econ'
  | 'elec'
  | 'electr'
  | 'embryo'
  | 'engr'
  | 'ent'
  | 'figskt'
  | 'film'
  | 'finc'
  | 'fish'
  | 'food'
  | 'gardn'
  | 'genet'
  | 'geogr'
  | 'geol'
  | 'geom'
  | 'go'
  | 'golf'
  | 'gramm'
  | 'grmyth'
  | 'hanaf'
  | 'horse'
  | 'internet'
  | 'jpmyth'
  | 'kabuki'
  | 'law'
  | 'ling'
  | 'logic'
  | 'mA'
  | 'mahj'
  | 'manga'
  | 'math'
  | 'mech'
  | 'med'
  | 'met'
  | 'mil'
  | 'min'
  | 'mining'
  | 'motor'
  | 'music'
  | 'noh'
  | 'ornith'
  | 'paleo'
  | 'pathol'
  | 'pharm'
  | 'phil'
  | 'photo'
  | 'physics'
  | 'physiol'
  | 'politics'
  | 'print'
  | 'prowres'
  | 'psy'
  | 'psyanal'
  | 'psych'
  | 'rail'
  | 'rommyth'
  | 'shinto'
  | 'shogi'
  | 'ski'
  | 'sports'
  | 'stat'
  | 'stockm'
  | 'sumo'
  | 'surg'
  | 'telec'
  | 'tradem'
  | 'tv'
  | 'vet'
  | 'vidg'
  | 'zool';

/**
 * This element is used for other relevant information about the entry/sense.
 * As with part-of-speech, information will usually	apply to several senses.
 */
export type JMdictSensMisc =
  | 'abbr'
  | 'arch'
  | 'char'
  | 'chn'
  | 'col'
  | 'company'
  | 'creat'
  | 'dated'
  | 'dei'
  | 'derog'
  | 'doc'
  | 'euph'
  | 'ev'
  | 'fam'
  | 'fem'
  | 'fict'
  | 'form'
  | 'given'
  | 'group'
  | 'hist'
  | 'hon'
  | 'hum'
  | 'id'
  | 'joc'
  | 'leg'
  | 'mSl'
  | 'male'
  | 'myth'
  | 'netSl'
  | 'obj'
  | 'obs'
  | 'onMim'
  | 'organization'
  | 'person'
  | 'place'
  | 'poet'
  | 'pol'
  | 'product'
  | 'proverb'
  | 'quote'
  | 'rare'
  | 'sens'
  | 'serv'
  | 'ship'
  | 'sl'
  | 'surname'
  | 'uk'
  | 'unclass'
  | 'vulg'
  | 'work'
  | 'yoji';

// ISO 639-2T
export type JMdictSensLSourceLang =
  | 'por'
  | 'spa'
  | 'kor'
  | 'chi'
  | 'ger'
  | 'fre'
  | 'eng'
  | 'ain'
  | 'lat'
  | 'swa'
  | 'grc'
  | 'ita'
  | 'rus'
  | 'dut'
  | 'afr'
  | 'gre'
  | 'per'
  | 'ara'
  | 'haw'
  | 'epo'
  | 'swe'
  | 'heb'
  | 'san'
  | 'ind'
  | 'est'
  | 'mon'
  | 'fin'
  | 'may'
  | 'tur'
  | 'hin'
  | 'dan'
  | 'nor'
  | 'ukr'
  | 'pol'
  | 'tha'
  | 'tgl'
  | 'rum'
  | 'mol'
  | 'bul'
  | 'khm'
  | 'tib'
  | 'vie'
  | 'arn'
  | 'tah'
  | 'hun'
  | 'alg'
  | 'bur'
  | 'yid'
  | 'bnt'
  | 'fil'
  | 'urd'
  | 'som'
  | 'mnc'
  | 'bre'
  | 'kur'
  | 'chn'
  | 'mal'
  | 'amh'
  | 'tam'
  | 'mao'
  | 'glg'
  | 'cze'
  | 'slv'
  | 'geo'
  | 'ice'
  | 'slo'
  | 'scr'
  | undefined; // ISO 639-2T
