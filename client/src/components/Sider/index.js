import React, { Component } from 'react'

import './index.scss'

import AddTagModal from './AddTagModal'
import ContextMenu from '@/components/ContextMenu'
import { emit } from '@/components/ContextMenu/trigger'
import { Layout, Tree, Modal, message } from 'antd'

import axios from 'axios'

const { Sider } = Layout
const { TreeNode } = Tree

class AppSider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddTagModal: false,
      tags: [{
        id: 0,
        name: '标签'
      }],
      menu: [
        {
          id: 1,
          name: '添加',
          callback: this.handleAddTag.bind(this)
        },
        {
          id: 2,
          name: '移除',
          callback: this.handleDelTag.bind(this)
        }
      ]
    }
    this.id = 3
    this.currNode = null
  }


  componentDidMount () {
    axios.get('/api/tags')
    .then((response) => {
      if (Array.isArray(response.data)) {
        this.setState({
          tags: response.data
        })
      }
    }, (err) => {
      console.log(err)
    })
  }

  activeContextMenu (e, node) {
    emit(e, node)
  }

  handleAddTag (node) {
    this.currNode = node
    this.setState({
      showAddTagModal: true
    })
  }

  handleDelTag (node) {
    if (Number(node.props.eventKey) === 0) {
      return message.error('不能删除根标签！')
    }
    Modal.confirm({
      title: '确定要删除 ' + node.props.title + ' ?',
      onOk: () => {
        this.delTag(node)
      }
    })
  }

  delTag (node) {
    const data = [...this.state.tags]
    let id = node.props.eventKey
    this.findNode(data, id, (item, index, arr) => {
      arr.splice(index, 1)
    })

    this.setState({
      tags: data
    })
  }

  addTag (name) {
    axios.post('/api/tags', {name: name})
    .then((response) => {
      console.log(response.data)
      this.renderTag(response.data)
    }, (err) => {
      console.log(err)
    })
  }

  renderTag (tag) {
    const data = [...this.state.tags]
    let id = this.currNode.props.eventKey

    this.findNode(data, id, (item) => {
      if (!item.children) item.children = []
      item.children.push(tag)
    })

    this.setState({
      tags: data
    })
    this.currNode = null

    this.hideModal()
  }

  findNode (data, id, callback) {
    const loop = (data, id, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id + '' === id + '') {
          return callback(item, index, arr)
        }
        if (item.children) {
          loop(item.children, id, callback)
        }
      })
    }

    loop(data, id, callback)
  }

  hideModal () {
    this.setState({
      showAddTagModal: false
    })
  }

  render () {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode key={item.id} title={item.name}/>
    })
    const { menu, tags, showAddTagModal } = this.state
    return (
      <Sider styleName="app-sider" width="300">
        <AddTagModal visible={showAddTagModal} onHide={this.hideModal.bind(this)} onOk={this.addTag.bind(this)}></AddTagModal>
        <ContextMenu data={menu}></ContextMenu>
        <Tree expandedKeys={['0']} onRightClick={({event, node}) => {this.activeContextMenu(event, node)}}>
          {loop(tags)}
        </Tree>
      </Sider>
    )
  }
}

export default AppSider
