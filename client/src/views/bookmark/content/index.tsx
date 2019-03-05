import * as React from 'react'
import { Layout, Modal, Button } from 'antd'
import SingleBookmark from '../single-bookmark'
import AddBookmark from '@/components/add-bookmark'
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

const {useRef, useState} = React
export default function BookmarkContent () {
  let bk$ = DL.bookmarks.get()
  let bookmarks = useObservable<Bookmark[]>(() => bk$, [])
  let [visible, setVisible] = useState(false)
  let addBkRef = useRef(null)
  let quickAdd = getQuickAddBookmark()
  const submitAddBk = () => {
    addBkRef.current.handleSubmit()
    setVisible(false)
  }
  const loopBk = bookmarks.map((bookmark: Bookmark) => {
    return <SingleBookmark bookmark={bookmark} key={bookmark.__key__}></SingleBookmark>
  })
  return (
    <Layout styleName="content">
      <Modal title={'添加书签'} visible={visible} onOk={submitAddBk} onCancel={() => setVisible(false)}>
        <AddBookmark ref={addBkRef}></AddBookmark>
      </Modal>
      <h3 styleName="title">
        <span>所有书签</span>
        <Button onClick={() => setVisible(true)}>添加书签</Button>
        <a styleName="quick-add" href={quickAdd} title="拖拽至浏览器书签栏">快捷添加书签</a>
      </h3>
      <ul>
        {loopBk}
      </ul>
    </Layout>
  )
}
