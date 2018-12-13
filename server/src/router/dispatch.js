const parseUrlParamsValue = (ctx) => {
  let route = ctx._matchedRoute
  let params = ctx.params

  let paramsKeys = route.split('/').filter(str => str.startsWith(':'))

  return paramsKeys.map(key => params[key.slice(1)])
}

const parseParams = (ctrlFn, ctx) => {
  let fnParamKeys = parseCtrlFnParamList(ctrlFn)

  let formParams = ctx.method === 'GET' ? ctx.request.query : ctx.request.body
  let urlParamsValue = parseUrlParamsValue(ctx)

  let defaultParams = {
    $request: ctx.request,
    $form: formParams,
    $urlParams: ctx.params,
    $get: ctx.request.query,
    $post: ctx.request.body
  }

  let i = 0

  let params = fnParamKeys.map(pk => {
    let pv = defaultParams[pk]

    if (!pv) {
      pv = urlParamsValue[i]
      i++
    }
    return pv
  })
  return params
}

const parseCtrlFnParamList = (fn) => {
  const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg
  const ARGUMENT_NAMES = /([^\s,]+)/g

  let fnStr = fn.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if (result === null) result = []

  return result;
}

const dispatch = async (execFnOrCtrl, ctx, next) => {
  let type = typeof execFnOrCtrl
  let result = ''

  switch (type) {
    case 'function':
      result = await execFnOrCtrl(ctx)
      break
    case 'string':
      let [ctrl, fn] = execFnOrCtrl.split('@')
      try {
        const Controller = require('../services/' + ctrl + '/index.js')

        const controller = new Controller(ctx)
        const method = controller[fn]
        let params = parseParams(method, ctx)
        result = await method.apply(controller, params)
      } catch (e) {
        ctx.throw(e)
      }
      break
    default:
      ctx.throw(500, 'route callback is not a function or a Controller methods')
      break
  }

  if (typeof result === 'object') result = JSON.stringify(result)
  if (typeof result !== 'string') {

  }
  ctx.body = result
  next()
}

module.exports = dispatch
