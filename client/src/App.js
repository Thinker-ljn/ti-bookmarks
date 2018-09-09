import React, { Component } from 'react'
import AppHeader from '@/components/Header'
import AppSider from '@/components/Sider'
import AppContent from '@/components/Content'

import './app.css'

import { Layout } from 'antd'
const { Footer } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.addBookmarkToBrowser = this.addBookmarkToBrowser.bind(this)
  }

  addBookmarkToBrowser (e) {
    e.preventDefault()
    let url = 'localhost:8001'
    let exec = `(function(){
      var h = window.screen.availHeight;var w = window.screen.availWidth;window.open("http://${url}/add-bookmark?u="+encodeURIComponent(window.location.href)+"&t="+encodeURIComponent(document.title),"添加书签","height=340,width="+380+",top="+(h/2-165)+",left="+(w/2-185)+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no");})()`
    let string = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(exec) + '))'
    console.log(string)
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
