import * as React from 'react'
import { Layout } from 'antd'
import SingleBookmark from '../single-bookmark'
import './index.scss'

import axios from 'axios'

type bookmark = {
  id: number,
  name: string,
  url: string
}
type stateType = {
  bookmarks: bookmark[]
}
class AppContent extends React.Component<{}, stateType> {
  constructor(props: {}) {
    super(props)

    this.state = {
      bookmarks: []
    }
  }

  componentDidMount () {
    axios.get('/api/bookmarks')
    .then((response) => {
      console.log(response.data)
      if (Array.isArray(response.data)) {
        this.setState({
          bookmarks: response.data
        })
      }
    }, (err) => {
      console.log(err)
    })
  }

  getQuickAddBookmark () {
    let {host, protocol} = location
    let url = `${protocol}//${host}/add-bookmark?u=${encodeURIComponent(window.location.href)}&t=${encodeURIComponent(document.title)}`
    let title = '添加书签'
    let w = 400
    let h = 380
    let t = window.screen.availHeight/2 - h/2
    let l = window.screen.availWidth/2 - w/2
    let exec = `window.open("${url}","${title}","height=${h},width=${w},top=${t},left=${l},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no")`
    let execFn = `(function(){${exec}})()`
    let command = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(execFn) + '))'
    return command
  }

  render () {
    const { bookmarks } = this.state
    let quickAdd = this.getQuickAddBookmark()
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
}

export default AppContent
