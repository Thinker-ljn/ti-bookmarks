import * as React from 'react'

import './index.scss'

import { Layout, Tree, Modal, message } from 'antd'
import { useObservable } from 'rxjs-hooks'
import ContextMenu, { menu } from '../context-menu'
import AddTagModal from './add-tag-modal'
import { AntTreeNode } from 'antd/lib/tree'
import { emit } from '../context-menu/trigger'
import DH from '@/plugin/data-hub'

const { Sider } = Layout
const { TreeNode } = Tree
export type tag = {
  id: number,
  name: string,
  children?: tag[],
  parent_id?: number,
  updated_at?: any,
  created_at?: any
}

function activeContextMenu (e: React.MouseEventHandler<any>, node: AntTreeNode) {
  emit(e, node)
}



let currNodeId: number = 0
export default function AppSider () {
  let { useState } = React
  let tags: tag[] = useObservable(() => DH.get('tags', 'tagsTree'), [])
  let [showAddTagModal, setShowAddTagModal] = useState(false)
  // let [currNode, setCurrNode] = useState(null)

  const addTag = (name: string) => {
    let params = {
      name: name,
      parent_id: currNodeId
    }
    DH.action('tags', 'post', params).then(() => {
      setShowAddTagModal(false)
    })
  }

  const handleDelTag = (node: AntTreeNode) => {
    if (Number(node.props.eventKey) === 0) {
      return message.error('不能删除根标签！')
    }
    Modal.confirm({
      title: '确定要删除 ' + node.props.title + ' ?',
      onOk: () => {
        let id = node.props.eventKey
        DH.action('tags', 'delete', {id: id})
      }
    })
  }

  const menu: menu = [
    {
      id: 1,
      name: '添加',
      callback: (node: AntTreeNode) => {
        setShowAddTagModal(true)
        currNodeId = Number(node.props.eventKey)
      }
    },
    {
      id: 2,
      name: '移除',
      callback: handleDelTag
    }
  ]

  const loop = (tags: tag[]) => tags.map((tag) => {
    let key: string = tag.id + ''
    if (tag.children && tag.children.length) {
      return <TreeNode key={key} title={tag.name}>{loop(tag.children)}</TreeNode>
    }
    return <TreeNode key={key} title={tag.name}/>
  })

  return (
    <Sider styleName="app-sider" width="300">
      <AddTagModal visible={showAddTagModal} onHide={() => setShowAddTagModal(false)} onOk={addTag}></AddTagModal>
      <ContextMenu data={menu}></ContextMenu>
      <Tree expandedKeys={['0']} onRightClick={({event, node}) => {activeContextMenu(event, node)}}>
        {loop(tags)}
      </Tree>
    </Sider>
  )
}
