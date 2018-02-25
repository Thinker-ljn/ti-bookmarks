const routes = [
  {
    p: '/',
    m: 'get',
    f: () => { return 'hello world!!!!!' }
  },
  {
    p: '/bookmarks/:id',
    m: 'get',
    f: 'bookmark@index'
  },
  ['post', '/bookmarks', 'bookmark@create'],
  ['delete', '/bookmarks/:id', 'bookmark@delete']
]

const des = (route) => {
  if (Array.isArray(route)) {
    return route
  }

  let {p, m, f} = route

  return [m, p, f]
}

const dispatch = require('./dispatch')
const Router = require('koa-router')
const router = new Router()

routes.forEach(route => {
  // p: route params, m: http methods, f: controller function
  let [m, p, f] = des(route)
  router[m](p, async (ctx, next) => {
    await dispatch(f, ctx, next)
  })
})

module.exports = router
