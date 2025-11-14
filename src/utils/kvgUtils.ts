import {KanjiStroke} from 'tkdb-helper';
import {KVGKanjiGroup} from '../schemas/kanjivgSchema';
import {toArrayOrUndefined} from '../utils';

export const toHex = (literal: string): string => {
  // Ensure the input is valid for characters outside the BMP
  const codePoint = literal.codePointAt(0);

  if (codePoint === undefined) {
    throw new Error('Invalid character input.');
  }

  const hexString = codePoint.toString(16).toLowerCase();

  // Ensure the result is a five-digit string
  return hexString.padStart(5, '0');
};

export const extractXYfromPath = (path: string): {x: string; y: string} => {
  // Regular expression to match the pattern, case-insensitive
  const regex = /M\s*([\d.]+)\s*,\s*([\d.]+)\s*c/i;
  const match = path.match(regex);

  if (
    match !== null &&
    match.length > 2 &&
    match[1] !== undefined &&
    match[2] !== undefined
  ) {
    return {x: match[1], y: match[2]};
  }

  // Return null if the pattern doesn't match
  throw new Error(`Could not extract x and y positions from ${path}`);
};

export interface ParsedStrokes {
  path: string;
  x: string;
  y: string;
}

export const parseStrokes = (
  kanjivgMap: Map<string, KVGKanjiGroup>,
  literal: string
): ParsedStrokes[] | undefined => {
  const hexLiteral = toHex(literal);
  const lookupKey = `kanji_${hexLiteral}`;
  const match = kanjivgMap.get(lookupKey);

  if (match === undefined) {
    return undefined;
  }

  const strokes: KanjiStroke[] = [];

  const processGroups = (groups: KVGKanjiGroup[]): void => {
    for (const group of groups) {
      const subGroups = toArrayOrUndefined(group.g);

      if (subGroups !== undefined) {
        processGroups(subGroups);
      }

      const paths = toArrayOrUndefined(group.path);

      if (paths !== undefined) {
        for (const path of paths) {
          const strokePath = path.d;
          const {x, y} = extractXYfromPath(strokePath);

          strokes.push({
            path: strokePath,
            y,
            x,
          });
        }
      }
    }
  };

  const parentGroups = toArrayOrUndefined(match.g);
  if (parentGroups === undefined) {
    return undefined;
  }

  processGroups(parentGroups);

  return strokes;
};
