import {readFile, writeFile} from 'fs/promises';
import {toRomaji, isRomaji} from 'wanakana';
import {xxh32} from '@node-rs/xxhash';
import {red} from 'chalk';

export const toStrictRomaji = (input = ''): string => {
  const romaji = toRomaji(input);
  return isRomaji(romaji) ? romaji : '';
};

export const toHash = (input: string): string => {
  const hash = xxh32(input).toString(16);
  return hash;
};

export const toArray = <T>(input: T[] | T): T[] => {
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
};

export const toArrayOrUndefined = <T>(
  input: T[] | T | undefined,
): T[] | undefined => {
  if (Array.isArray(input)) {
    return input;
  } else if (input !== undefined) {
    return [input] as T[];
  } else {
    return undefined;
  }
};

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const fileContent = await readFile(filePath, 'utf8');
  return JSON.parse(fileContent) as T;
};

export const writeJsonFile = async (
  value: unknown,
  filePath: string,
): Promise<void> => {
  const data = JSON.stringify(value, null, 2);
  await writeFile(`output/json/${filePath}`, data);
};

function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

export async function writeCSVFile<T extends Record<string, unknown>>(
  data: T[],
  filePath: string,
  headers?: (keyof T)[],
): Promise<void> {
  if (data.length === 0) {
    throw new Error('No data to write');
  }

  const escapeCsvValue = (val: unknown): string => {
    let str: string;
    if (val === null || val === undefined) {
      str = '';
    } else if (typeof val === 'object') {
      str = JSON.stringify(val);
    } else {
      str = String(val);
    }

    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // If headers passed → only those fields, otherwise all keys from first object
  const keys: (keyof T)[] = headers ?? (Object.keys(data[0]) as (keyof T)[]);

  // Header row (snake_case)
  const headerRow = keys.map(key => camelToSnake(String(key)));
  const csvRows: string[] = [headerRow.join(',')];

  // Data rows
  for (const row of data) {
    const csvRow = keys.map(key => escapeCsvValue(row[key]));
    csvRows.push(csvRow.join(','));
  }

  const csvString = csvRows.join('\n');
  await writeFile(`output/csv/${filePath}`, csvString);
}

export const setIncludesExactRecordKeys = <T extends string>(
  set: Set<T>,
  record: Record<T, unknown>,
  setIdentifier: string,
): void => {
  const missingKeys: T[] = [];
  const extraKeys: T[] = [];

  const recordKeys = new Set(Object.keys(record) as T[]);

  // Check for keys in the record that are missing in the set
  for (const key of recordKeys) {
    if (!set.has(key)) {
      missingKeys.push(key);
    }
  }

  // Check for keys in the set that are not in the record
  for (const key of set) {
    if (!recordKeys.has(key)) {
      extraKeys.push(key);
    }
  }

  // If there are any missing or extra keys, throw an error
  if (missingKeys.length > 0 || extraKeys.length > 0) {
    let errorMessage = 'Mismatch found:';
    if (missingKeys.length > 0) {
      errorMessage += `\n  - Missing keys in TKDB ${setIdentifier}: ${missingKeys.join(', ')}`;
    }
    if (extraKeys.length > 0) {
      errorMessage += `\n  - Extra keys in TKDB ${setIdentifier}: ${extraKeys.join(', ')}`;
    }
    console.log(red(errorMessage));
  }

  // If no errors were thrown, the set includes exactly the same keys as the record
};
