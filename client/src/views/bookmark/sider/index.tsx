import * as React from 'react'

import './index.scss'

import AddTagModal from './add-tag-modal'
import ContextMenu, { menuItem } from '../context-menu'
import { emit } from '../context-menu/trigger'
import { Layout, Tree, Modal, message } from 'antd'
import { AntTreeNode } from 'antd/lib/tree'
import axios from 'axios'

const { Sider } = Layout
const { TreeNode } = Tree
export type tag = {
  id: number,
  name: string,
  children?: tag[]
}
interface tagMap {
  [key: string]: tag;
}
type SiderState = {
  showAddTagModal: boolean,
  tags: tag[],
  tagMap: tagMap,
  menu: menuItem[]
}
type findNodeCbPayload = {
  tag: tag, index: number, arr: tag[]
}
type findNodeCb = (payload: findNodeCbPayload) => void

class AppSider extends React.Component<any, SiderState> {
  // private id: number = 3
  private currNode: any = null
  constructor(props: any) {
    super(props)

    this.state = {
      showAddTagModal: false,
      tags: [{
        id: 0,
        name: '标签'
      }],
      tagMap: {},
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

  activeContextMenu (e: React.MouseEventHandler<any>, node: AntTreeNode) {
    emit(e, node)
  }

  handleAddTag (node: AntTreeNode) {
    this.currNode = node
    this.setState({
      showAddTagModal: true
    })
  }

  handleDelTag (node: AntTreeNode) {
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

  delTag (node: AntTreeNode) {
    const data = [...this.state.tags]
    let id = node.props.eventKey
    this.findNode(data, id, ({index, arr}) => {
      arr.splice(index, 1)
    })

    this.setState({
      tags: data
    })
  }

  addTag (name: string) {
    axios.post('/api/tags', {name: name})
    .then((response) => {
      console.log(response.data)
      this.renderTag(response.data)
    }, (err) => {
      console.log(err)
    })
  }

  renderTag (tag: tag) {
    const data = [...this.state.tags]
    let id = this.currNode.props.eventKey

    this.findNode(data, id, ({tag: pTag}) => {
      if (!pTag.children) pTag.children = []
      pTag.children.push(tag)
    })

    this.setState({
      tags: data
    })
    this.currNode = null

    this.hideModal()
  }

  findNode (data: tag[], id: number|string, callback: findNodeCb) {
    const loop = (data: tag[], id: number|string, callback: findNodeCb) => {
      data.forEach((tag, index, arr) => {
        if (tag.id + '' === id + '') {
          return callback({tag, index, arr})
        }
        if (tag.children) {
          loop(tag.children, id, callback)
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
    const loop = (tags: tag[]) => tags.map((tag) => {
      let key: string = tag.id + ''
      if (tag.children && tag.children.length) {
        return <TreeNode key={key} title={tag.name}>{loop(tag.children)}</TreeNode>
      }
      return <TreeNode key={key} title={tag.name}/>
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
