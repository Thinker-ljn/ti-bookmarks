const routes = [
  {
    p: '/api/bookmarks',
    m: 'get',
    f: 'bookmark@index'
  },
  ['post', '/api/bookmarks', 'bookmark@create'],
  ['patch', '/api/bookmarks', 'bookmark@update'],
  ['delete', '/api/bookmarks/:id', 'bookmark@delete'],

  ['get', '/api/tags', 'tag@index'],
  ['post', '/api/tags', 'tag@create'],
  ['patch', '/api/tags', 'tag@update'],
  ['delete', '/api/tags/:id', 'tag@delete']
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
