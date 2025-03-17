export class SetManager {
  public wordFormInfo: Set<string>;
  public wordSensePos: Set<string>;
  public wordSenseField: Set<string>;
  public wordSenseMisc: Set<string>;
  public wordSenseDial: Set<string>;
  public wordGlossType: Set<string>;

  constructor() {
    this.wordFormInfo = new Set();
    this.wordSensePos = new Set();
    this.wordSenseField = new Set();
    this.wordSenseMisc = new Set();
    this.wordSenseDial = new Set();
    this.wordGlossType = new Set();
  }
}

export const setManager = new SetManager();
