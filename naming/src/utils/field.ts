import type { FileNamingFieldDefinition } from '../types/field.js'

export const createCharNamingField = <KEY extends string>(char: KEY, label?: string) => {
  return {
    [char]: {
      label: label ?? char,
      resolve: () => ' ',
    } as FileNamingFieldDefinition,
  } as {
    [k in KEY]: FileNamingFieldDefinition
  }
}

export const createCharNamingFields = <const CHARS extends readonly string[]>(chars: CHARS) => {
  return Object.assign({}, ...chars.map((char) => createCharNamingField(char))) as {
    [K in CHARS[number]]: FileNamingFieldDefinition
  }
}
