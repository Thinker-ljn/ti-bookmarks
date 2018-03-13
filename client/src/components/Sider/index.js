import React, { Component } from 'react'

import './index.scss'

import AddTagModal from './AddTagModal'
import ContextMenu from '@/components/ContextMenu'
import { emit } from '@/components/ContextMenu/trigger'
import { Layout, Tree } from 'antd'
const { Sider } = Layout
const { TreeNode } = Tree

class AppSider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddTagModal: false,
      tags: [{
        id: 0,
        name: '标签',
        children: [{
          id: 1,
          name: '前端'
        }]
      }],
      menu: [
        {
          id: 1,
          name: '添加',
          callback: this.handleAddTag.bind(this)
        },
        {
          id: 2,
          name: '移除'
        }
      ]
    }
    this.id = 3
    this.currNode = null
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

  addTag (name) {
    let node = {
      id: this.id++,
      name: name,
    }

    const loop = (data, id, callback) => {
      data.forEach((item) => {
        if (item.id + '' === id + '') {
          return callback(item)
        }
        if (item.children) {
          loop(item.children, id, callback)
        }
      })
    }
    const data = [...this.state.tags]
    let id = this.currNode.props.eventKey

    loop(data, id, (item) => {
      if (!item.children) item.children = []
      item.children.push(node)
    })

    this.setState({
      tags: data
    })
    this.currNode = null

    this.hideModal()
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
        <Tree onRightClick={({event, node}) => {this.activeContextMenu(event, node)}}>
          {loop(tags)}
        </Tree>
      </Sider>
    )
  }
}

export default AppSider
