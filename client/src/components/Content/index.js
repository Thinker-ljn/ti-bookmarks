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
      this.setState({
        bookmarks: response.data
      })
    }, (err) => {
      console.log(err)
    })
  }

  render () {
    const { bookmarks } = this.state

    const loopBk = function () {
      return bookmarks.map(bookmark => {
        return (
          <SingleBookmark bookmark={bookmark} key={bookmark.id}></SingleBookmark>
        )
      })
    }
    return (
      <Layout styleName="content">
        <h3 styleName="title">所有书签</h3>
        <ul>
          {loopBk()}
        </ul>
      </Layout>
    )
  }
}

export default AppContent
