declare module 'parameter'

declare interface ValidateResult {
  message: string,
  code: string,
  field: string | undefined
}

type Convert = string | ((v: any) => any)
type ObjectRule = {
  required: boolean,
  type: string,
  format?: RegExp,
  convertType?: Convert
}

declare type Rule = string | string[] | RegExp | ObjectRule
declare type Rules = {
  [key: string]: Rule
}

declare type ToBeCheckObj = {
  [key: string]: any
}

declare class Parameter {
  validate (rules: Rules, obj: ToBeCheckObj): ValidateResult[]
}
