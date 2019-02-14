import React, { Component } from 'react'
/* eslint-disable */
import styles from './index.css'

import axios from 'axios'
import { Layout, Input, Row, Col, Button } from 'antd'
const { Content, Header, Footer } = Layout
import Tags from './Tags/index.tsx'

class AddBookmark extends Component {
  constructor(props) {
    super(props)

    let searchParams = new URLSearchParams(location.search.slice(1))
    let url = searchParams.get('u')
    let name = searchParams.get('t')

    this.state = {
      name: name,
      url: url
    }
  }

  handleChange (e, name) {
    let state = {}
    state[name] = e.target.value
    this.setState(state)
  }

  handleSubmit () {
    axios.post('/api/bookmarks', {
      name: this.state.name,
      url: this.state.url,
      tag_id: 0
    }).then((response) => {
      console.log(response)
      this.handleClose()
    }, (err) => {
      console.log(err)
    })
  }

  handleClose () {
    window.close()
  }

  rows () {
    return ['name', 'url'].map((name) => {
      return (
        <Row type="flex" align="middle" style={{ marginBottom: 16 }} key={name}>
          <Col offset={1} span={3}>{name}:</Col>
          <Col span={18}>
            <Input value={this.state[name]} onChange={e => this.handleChange(e, name)}></Input>
          </Col>
        </Row>
      )
    })
  }

  render() {
    return (
      <Layout styleName="styles.layout">
        <Layout styleName="styles.inner-layout">
          <Header>
            <h3 style={{ color: '#eee' }}>填写标签信息</h3>
          </Header>
          <Content styleName="styles.content">
            {this.rows()}
            <Tags></Tags>
          </Content>
          <Footer styleName="styles.footer">
            <Button type="primary" onClick={e => this.handleSubmit(e)}>提交</Button>
            <Button style={{ marginLeft: 16 }} onClick={e => this.handleClose(e)}>关闭</Button>
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default AddBookmark
