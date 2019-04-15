import React, { Component } from 'react'
import AppHeader from '@fe/src/components/header'
import Bookmark from '@fe/src/views/bookmark'

import './App.css'

import { Layout } from 'antd'
const { Footer } = Layout

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout styleName="app">
        <AppHeader></AppHeader>
        <Layout styleName="app-content">
          <Bookmark></Bookmark>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}

export default App
