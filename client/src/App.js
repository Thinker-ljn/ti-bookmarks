import React, { Component } from 'react'
import AppHeader from '@/components/Header'
import AppSider from '@/components/Sider'
import AppContent from '@/components/Content'

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
          <AppSider></AppSider>
          <AppContent>
          </AppContent>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}

export default App
