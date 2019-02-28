import * as React from 'react'
import { Layout } from 'antd'
import SingleBookmark from '../single-bookmark'
import './index.scss'

import DL, { Bookmark } from '@/plugin/data-layer'
import { useObservable } from 'rxjs-hooks'

function getQuickAddBookmark () {
  let {host, protocol} = location
  let currUrl = encodeURIComponent(window.location.href)
  let currTitle = encodeURIComponent(document.title)
  let windowUrl = `${protocol}//${host}/add-bookmark?u=${currUrl}&t=${currTitle}`
  let windowTitle = '添加书签'
  let w = 400
  let h = 380
  let t = window.screen.availHeight/2 - h/2
  let l = window.screen.availWidth/2 - w/2
  let exec = `window.open("${windowUrl}","${windowTitle}","height=${h},width=${w},top=${t},left=${l},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no")`
  let execFn = `(function(){${exec}})()`
  let command = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(execFn) + '))'
  return command
}

export default function BookmarkContent () {
  let bookmarks: Bookmark[] = useObservable(() => DL.bookmarks.get(), [])

  let quickAdd = getQuickAddBookmark()
  const loopBk = function () {
    return bookmarks.map(bookmark => {
      return (
        <SingleBookmark bookmark={bookmark} key={bookmark.id}></SingleBookmark>
      )
    })
  }

  return (
    <Layout styleName="content">
      <h3 styleName="title">所有书签<a styleName="quick-add" href={quickAdd} title="拖拽至浏览器书签栏">快捷添加书签</a></h3>
      <ul>
        {loopBk()}
      </ul>
    </Layout>
  )
}
