import { Context } from 'koa';
import * as Router from 'koa-router'
import { parseParams } from './utils';

export type ControllerMethod = (...args: any) => any
type Method = 'get' | 'post' | 'patch' | 'delete'
type Handler = string | ControllerMethod
type Path = string

interface ObjectRoute {m: Method, p: Path, h: Handler}
type SimpleRoute = [Method, Path, Handler]
type Route = ObjectRoute | SimpleRoute
export type Routes = Route[]
type Next = () => Promise<any>

function des (route: Route): SimpleRoute {
  if (Array.isArray(route)) {
    return route
  }
  const {m, p, h} = route
  return [m, p, h]
}

const dispatch = async (execFnOrCtrl: Handler, ctx: Context, next: Next) => {
  let result: any = ' '
  if (typeof execFnOrCtrl === 'function') {
    result = await execFnOrCtrl(ctx)
  } else if (typeof execFnOrCtrl === 'string') {
    const [ctrl, fn] = execFnOrCtrl.split('@')
    try {
      const classController = require('@be/src/services/' + ctrl + '/index.js').default

      const controller = new classController(ctx)
      const method = controller[fn]
      const params = parseParams(method, ctx)
      result = await method.apply(controller, params)
    } catch (e) {
      ctx.status = e.status || 500
      result = e.stack
    }
  } else {
    ctx.status = 405
    result = 'route callback is not a function or a Controller methods'
  }

  if (typeof result === 'object') {
    result = JSON.stringify(result)
  }
  ctx.body = result
  next()
}

export const initRouter = (routes: Routes) => {
  const router = new Router()

  routes.forEach(route => {
    const [m, p, h] = des(route)

    router[m](p, async (ctx: Context, next: Next) => {
      await dispatch(h, ctx, next)
    })
  })

  return router
}
