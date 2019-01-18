import React, { Component } from 'react'
import { Layout } from 'antd'
import SingleBookmark from '@/components/SingleBookmark'
import './index.scss'

import axios from 'axios'

class AppContent extends Component {
  constructor(props) {
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
    let {port, host, protocol} = location
    let url = protocol + '//' + host + (port ? `:${port}` : '')
    console.log(location, port, host, protocol, url)
    let exec = `(function(){var h = window.screen.availHeight;var w = window.screen.availWidth;window.open("${url}/add-bookmark?u="+encodeURIComponent(window.location.href)+"&t="+encodeURIComponent(document.title),"添加书签","height=340,width="+380+",top="+(h/2-165)+",left="+(w/2-185)+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no");})()`
    let string = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(exec) + '))'
    return string
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
