import { initRouter, Routes } from './core/router';

const routes: Routes = [
  {
    p: '/api/bookmarks',
    m: 'get',
    h: 'bookmark@index',
  },
  ['post', '/api/bookmarks', 'bookmark@create'],
  ['patch', '/api/bookmarks', 'bookmark@update'],
  ['delete', '/api/bookmarks/:id', 'bookmark@delete'],

  ['get', '/api/tags', 'tag@index'],
  ['post', '/api/tags', 'tag@create'],
  ['patch', '/api/tags', 'tag@update'],
  ['delete', '/api/tags/:id', 'tag@delete'],
  ['get', '/api/tags/:id/bookmarks', 'tag@bookmarks'],
]

export const router = initRouter(routes)
