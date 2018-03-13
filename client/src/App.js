import React, { Component } from 'react'
import AppHeader from '@/components/Header'
import AppSider from '@/components/Sider'

import './app.css'

import { Layout } from 'antd'
const { Footer, Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.addBookmarkToBrowser = this.addBookmarkToBrowser.bind(this)
  }

  addBookmarkToBrowser (e) {
    e.preventDefault()

    let exec = '(function(){var h = window.screen.availHeight;var w = window.screen.availWidth;window.open("http://localhost:8001/add-bookmark?u="+encodeURIComponent(window.location.href)+"&t="+encodeURIComponent(document.title),"添加书签","height=340,width="+380+",top="+(h/2-165)+",left="+(w/2-185)+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no");})()'
    let string = 'javascript:eval(decodeURIComponent(' + encodeURIComponent(exec) + '))'
    console.log(string)
  }

  render() {
    return (
      <Layout styleName="app">
        <AppHeader></AppHeader>
        <Layout styleName="app-content">
          <AppSider></AppSider>
          <Layout>
            <Content>
            </Content>
          </Layout>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    )
  }
}

export default App
