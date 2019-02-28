import * as React from 'react'
import { Layout, Tree, Modal, message } from 'antd'
import ContextMenu, { menu } from '../context-menu'
import AddTagModal from './add-tag-modal'
import './index.scss'

import { AntTreeNode } from 'antd/lib/tree'
import DL, {Tag} from '@/plugin/data-layer'
import { useObservable } from 'rxjs-hooks'
import { emit } from '../context-menu/trigger'

const { Sider } = Layout
const { TreeNode } = Tree

function activeContextMenu (e: React.MouseEventHandler<any>, node: AntTreeNode) {
  emit(e, node)
}

let currNodeId: number = 0
export default function AppSider () {
  let { useState } = React
  let tags: Tag[] = useObservable(() => DL.tags.get('tree'), [])
  let [showAddTagModal, setShowAddTagModal] = useState(false)

  const addTag = (name: string) => {
    let params = {
      name: name,
      parent_id: currNodeId
    }

    DL.tags.post(params)
  }

  const handleDelTag = (node: AntTreeNode) => {
    if (Number(node.props.eventKey) === 0) {
      return message.error('不能删除根标签！')
    }
    Modal.confirm({
      title: '确定要删除 ' + node.props.title + ' ?',
      onOk: () => {
        let id = node.props.eventKey
        DL.tags.delete({id: id})
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

  const loop = (tags: Tag[]) => tags.map((tag) => {
    let key: string = tag.id + ''
    if (tag.children && tag.children.length) {
      return <TreeNode key={key} title={tag.name}>{loop(tag.children)}</TreeNode>
    }
    return <TreeNode key={key} title={tag.name}/>
  })

  const renderTree = () => {
    if (tags.length) {
      return <Tree defaultExpandedKeys={['0']} onRightClick={({event, node}) => {activeContextMenu(event, node)}}>
              {loop(tags)}
            </Tree>
    }
  }

  return (
    <Sider styleName="app-sider" width="300">
      <AddTagModal visible={showAddTagModal} onHide={() => setShowAddTagModal(false)} onOk={addTag}></AddTagModal>
      <ContextMenu data={menu}></ContextMenu>
      {renderTree()}
    </Sider>
  )
}
