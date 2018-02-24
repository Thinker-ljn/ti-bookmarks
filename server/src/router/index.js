const routes = [
  {
    p: '/',
    m: 'get',
    f: () => { return 'hello world!!!!!' }
  },
  {
    p: '/bookmarks',
    m: 'get',
    f: 'bookmark@index'
  },
  ['post', '/bookmarks', 'bookmark@create']
]

const des = (route) => {
  if (Array.isArray(route)) {
    return route
  }

  let {p, m, f} = route

  return [m, p, f]
}

const parseParams = (ctx) => {
  let formParams = ctx.method === 'GET' ? ctx.request.query : ctx.request.body

  let urlParams = ctx.params

  return [formParams, urlParams]
}

const execFunction = async (execFnOrCtl, ctx, next) => {
  let type = typeof execFnOrCtl
  let result = ''
  let params = parseParams(ctx)
  switch (type) {
    case 'function':
      result = execFnOrCtl()
      break
    case 'string':
      let [ctl, fn] = execFnOrCtl.split('@')
      try {
        const Controller = require('../controller/' + ctl + '.js')
        result = await Controller[fn].apply(Controller, params)
      } catch (e) {
        console.log(e)
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

const Router = require('koa-router')
const router = new Router()

routes.forEach(route => {
  // p: route params, m: http methods, f: controller function
  let [m, p, f] = des(route)
  router[m](p, async (ctx, next) => {
    await execFunction(f, ctx, next)
  })
})

module.exports = router
