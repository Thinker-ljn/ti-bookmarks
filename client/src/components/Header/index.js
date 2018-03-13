import React, { Component } from 'react'
import { Layout, Input, Row, Col } from 'antd'

import './index.scss'
const { Header } = Layout
const SearchInput = Input.Search

class AppHeader extends Component {
  render () {
    return (
      <Header styleName="header">
        <Row styleName="header-content">
          <Col span="2">
              <span>Ti</span>
          </Col>
          <Col span="20">
            <SearchInput placeholder="输入关键字进行搜索"></SearchInput>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default AppHeader
