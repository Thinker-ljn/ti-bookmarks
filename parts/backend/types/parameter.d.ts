declare module 'parameter';

declare interface ValidateResult {
  message: string,
  code: string,
  field: string | undefined
}

declare type Rule = string | string[] | RegExp
declare type Rules = {
  [key: string]: Rule
}

declare type ToBeCheckObj = {
  [key: string]: any
}

declare class Parameter {
  validate (rules: Rules, obj: ToBeCheckObj): ValidateResult[]
}
