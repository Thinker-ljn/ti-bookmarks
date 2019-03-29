declare module 'parameter';

type Convert = string | ((v: any) => any)
type ObjectRule = {
  required?: boolean,
  type: string,
  format?: RegExp,
  convertType?: Convert
}

type Rule = string | string[] | RegExp | ObjectRule
type Rules = {
  [key: string]: Rule
}

type ToBeCheckObj = {
  [key: string]: any
}

interface ValidateResult {
  message: string,
  code: string,
  field: string | undefined
}

interface Parameter {
  validate: (rules: Rules, obj: ToBeCheckObj) => ValidateResult[]
}
// declare module parameter {
//   // export ValidateResult
//   // export type Rule
//   // export type Rules
//   // export type ToBeCheckObj
// }

// declare interface ValidateResult {
//   message: string,
//   code: string,
//   field: string | undefined
// }

// type Convert = string | ((v: any) => any)
// type ObjectRule = {
//   required?: boolean,
//   type: string,
//   format?: RegExp,
//   convertType?: Convert
// }

// declare type Rule = string | string[] | RegExp | ObjectRule
// declare type Rules = {
//   [key: string]: Rule
// }

// declare type ToBeCheckObj = {
//   [key: string]: any
// }

// declare class Parameter {
//   validate (rules: Rules, obj: ToBeCheckObj): ValidateResult[]
// }
