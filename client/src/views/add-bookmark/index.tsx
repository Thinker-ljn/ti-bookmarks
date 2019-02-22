import * as React from 'react'
import './index.scss'

import axios from 'axios'
import { Layout, Input, Row, Col, Button } from 'antd'
const { Content, Header, Footer } = Layout
import Tags from './tags/index'
import { tag, tagChangeEvent } from './tags/tag'

type State = {
  [key: string]: any,
  name: string,
  url: string,
  checkedTags: tag[],
  tags: tag[]
}

class AddBookmark extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    let searchParams = new URLSearchParams(location.search.slice(1))
    let url: string = searchParams.get('u')
    let name: string = searchParams.get('t')

    this.state = {
      name: name,
      url: url,
      checkedTags: [],
      tags: []
    }
  }

  componentDidMount () {
    axios.get('tags')
    .then((response) => {
      if (Array.isArray(response.data)) {
        let tags = response.data
        if (tags[0] && tags[0].id === 0) tags = tags[0].children || []
        this.setState({
          tags: tags
        })
      }
    }, (err) => {
      console.log(err)
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    let state: {[key: string]: any} = {}
    state[name] = e.target.value
    this.setState(state)
  }

  handleSubmit = () => {
    axios.post('bookmarks', {
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

  handleClose = () => {
    window.close()
  }

  onTagUpdate = (e: tagChangeEvent) => {
    let {tag, checked} = e
    if (checked) {
      console.log(tag)
    }
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
      <Layout styleName="layout">
        <Layout styleName="inner-layout">
          <Header>
            <h3 style={{ color: '#eee' }}>填写标签信息</h3>
          </Header>
          <Content styleName="content">
            {this.rows()}
            <Tags tags={this.state.tags} onTagUpdate={this.onTagUpdate}></Tags>
          </Content>
          <Footer styleName="footer">
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            <Button style={{ marginLeft: 16 }} onClick={this.handleClose}>关闭</Button>
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default AddBookmark
