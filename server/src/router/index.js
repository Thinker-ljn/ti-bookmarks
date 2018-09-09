const routes = [
  {
    p: '/',
    m: 'get',
    f: () => { return 'hello world!!!!!' }
  },
  {
    p: '/api/bookmarks',
    m: 'get',
    f: 'Bookmark@index'
  },
  ['post', '/api/bookmarks', 'Bookmark@create'],
  ['patch', '/api/bookmarks', 'Bookmark@update'],
  ['delete', '/api/bookmarks/:id', 'Bookmark@delete'],

  ['get', '/api/tags', 'Tag@index'],
  ['post', '/api/tags', 'Tag@create'],
  ['patch', '/api/tags', 'Tag@update'],
  ['delete', '/api/tags/:id', 'Tag@delete']
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
