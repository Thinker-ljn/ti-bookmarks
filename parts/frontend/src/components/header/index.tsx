import { Col, Input, Layout, Row } from 'antd'
import * as React from 'react'

import './index.scss'
const { Header } = Layout

export default class AppHeader extends React.Component<null, null> {
  public render () {
    return (
      <Header styleName='header'>
        <Row styleName='header-content'>
          <Col span={2}>
            <img styleName='icon' src='./favicon.ico'/>
            <span>Ti</span>
          </Col>
          <Col span={20}>
            <Input.Search placeholder='输入关键字进行搜索'></Input.Search>
          </Col>
        </Row>
      </Header>
    )
  }
}
