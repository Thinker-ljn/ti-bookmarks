import React, { Component } from 'react'
import { Layout } from 'antd'

import CSSModules from 'react-css-modules'
import style from './index.scss'
const { Content } = Layout

class AppContent extends Component {
  render () {
    return (
      <Layout>

      </Layout>
    )
  }
}

export default CSSModules(AppContent, style)
