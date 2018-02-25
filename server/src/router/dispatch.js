const parseParams = (ctrlFn, ctx) => {
  let fnParamKeys = parseCtrlFnParamList(ctrlFn)

  let formParams = ctx.method === 'GET' ? ctx.request.query : ctx.request.body
  let urlParams = ctx.params

  let defaultParams = {
    $request: ctx.request,
    $form: formParams,
    $urlParams: urlParams,
    $get: ctx.request.query,
    $post: ctx.request.body
  }

  let currParams = [urlParams]
  let i = 0

  let params = fnParamKeys.map(pk => {
    let pv = defaultParams[pk]

    if (!pv) {
      pv = currParams[i]
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
      result = await execFnOrCtrl()
      break
    case 'string':
      let [ctrl, fn] = execFnOrCtrl.split('@')
      try {
        const Controller = require('../controller/' + ctrl + '.js')

        const controller = new Controller
        let params = parseParams(controller[fn], ctx)
        result = await controller[fn].apply(controller, params)
      } catch (e) {
        console.log(e)
        result = e
      }
      break
    default:
      console.warn('route callback is not a function or a Controller methods')
      break
  }

  if (typeof result === 'object') result = JSON.stringify(result)
  if (typeof result !== 'string') {

  }
  ctx.body = result
  next()
}

module.exports = dispatch