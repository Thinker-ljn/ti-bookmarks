import AddBookmark, { AddBookmarkRef } from '@/components/add-bookmark'
import { Icon, Layout, Modal } from 'antd'
import * as React from 'react'
import SingleBookmark from '../single-bookmark'
import './index.scss'

import DL, { DLBookmark } from '@/plugins/data-layer'
import { useObservable } from 'rxjs-hooks'

function getQuickAddBookmark () {
  const {host, protocol} = location
  const currUrl = encodeURIComponent(window.location.href)
  const currTitle = encodeURIComponent(document.title)
  const windowUrl = `${protocol}//${host}/add-bookmark?u=${currUrl}&t=${currTitle}`
  const windowTitle = '添加书签'
  const w = 400
  const h = 380
  const t = window.screen.availHeight / 2 - h / 2
  const l = window.screen.availWidth / 2 - w / 2
  const windowProps = `height=${h},width=${w},top=${t},left=${l},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no`
  const exec = `window.open("${windowUrl}", "${windowTitle}", "${windowProps}")`
  const execFn = `(function(){${exec}})()`
  const command = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(execFn) + '))'
  return command
}

const {useRef, useState} = React
export default function BookmarkContent () {
  const [currEdit, setCurrEdit] = useState<DLBookmark|undefined>(void 0)
  const bookmarks = useObservable<DLBookmark[]>(() => DL.bookmarks.filterByTag_, [])
  const [visible, setVisible] = useState(false)
  const addBkRef: AddBookmarkRef = useRef(null)
  const quickAdd = getQuickAddBookmark()

  const submitAddBk = () => {
    if (!addBkRef.current) { return }
    addBkRef.current.handleSubmit()
    setVisible(false)
    setCurrEdit(void 0)
  }

  const editFn = (bookmark: DLBookmark) => {
    setCurrEdit(bookmark)
    setVisible(true)
  }

  const loopBk = bookmarks.map((bookmark: DLBookmark) => {
    return <SingleBookmark bookmark={bookmark} editFn={editFn} key={bookmark.__key__}></SingleBookmark>
  })
  return (
    <Layout styleName='content'>
      <Modal title={'添加书签'} visible={visible} onOk={submitAddBk} onCancel={() => setVisible(false)}>
        <AddBookmark currEdit={currEdit} ref={addBkRef}></AddBookmark>
      </Modal>
      <h3 styleName='title'>
        <span>所有书签</span>
        <span styleName='create-icon'>
          <Icon onClick={() => setVisible(true)} type='plus-circle' title='添加书签'></Icon>
        </span>
        <a styleName='quick-add' href={quickAdd} title='拖拽至浏览器书签栏'>快捷添加书签</a>
      </h3>
      <ul>
        {loopBk}
      </ul>
    </Layout>
  )
}
