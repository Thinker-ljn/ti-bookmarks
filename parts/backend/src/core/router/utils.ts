import { Context } from 'koa';
import { ControllerMethod } from '.';

const parseUrlParamsValue = (ctx: Context) => {
  const route: string = ctx._matchedRoute
  const params = ctx.params

  const paramsKeys = route.split('/').filter(str => str.startsWith(':'))

  return paramsKeys.map(key => params[key.slice(1)])
}

const parseControllerMethodParamList = (fn: ControllerMethod) => {
// tslint:disable-next-line: max-line-length
  const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg
  const ARGUMENT_NAMES = /([^\s,]+)/g

  const fnStr = fn.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if (result === null) { result = [] }

  return result;
}

export const parseParams = (ctrlFn: ControllerMethod, ctx: Context) => {
  const fnParamKeys = parseControllerMethodParamList(ctrlFn)

  const formParams = ctx.method === 'GET' ? ctx.request.query : ctx.request.body
  const urlParamsValue = parseUrlParamsValue(ctx)

  const defaultParams = {
    $request: ctx.request,
    $form: formParams,
    $urlParams: ctx.params,
    $get: ctx.request.query,
    $post: ctx.request.body,
  }

  let i = 0

  const params = fnParamKeys.map((pk: keyof typeof defaultParams) => {
    let pv = defaultParams[pk]

    if (!pv) {
      pv = urlParamsValue[i]
      i++
    }
    return pv
  })
  return params
}
