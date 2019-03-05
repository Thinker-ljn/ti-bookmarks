import * as React from 'react'
import { Layout, Tree, Modal, message } from 'antd'
import ContextMenu, { menu } from '../context-menu'
import AddTagModal from './add-tag-modal'
import './index.scss'

import { AntTreeNode } from 'antd/lib/tree'
import DL, {Tag} from '@/plugin/data-layer'
import { useObservable } from 'rxjs-hooks'
import { emit } from '../context-menu/trigger'
import { Dictionary } from 'lodash';

const { Sider } = Layout
const { TreeNode } = Tree

function activeContextMenu (e: React.MouseEventHandler<any>, node: AntTreeNode) {
  emit(e, node)
}

let currNodeId: number = 0
export default function AppSider () {
  let { useState } = React
  let tagsTree: Tag[] = useObservable(() => DL.tags.get('tree'), [])
  let tagsMap: Dictionary<Tag> = useObservable(() => DL.tags.get('map'), {})
  let [showAddTagModal, setShowAddTagModal] = useState(false)

  const addTag = (name: string) => {
    let params = {
      name: name,
      parent_id: currNodeId
    };

    DL.tags.post(params)
  }

  const handleDelTag = (node: AntTreeNode) => {
    if (Number(node.props.eventKey) === 0) {
      return message.error('不能删除根标签！')
    }
    Modal.confirm({
      title: '确定要删除 ' + node.props.title + ' ?',
      onOk: () => {
        let tag: Tag = tagsMap[node.props.eventKey]
        DL.tags.delete(tag)
      }
    })
  }

  const menu: menu = [
    {
      id: 1,
      name: '添加',
      callback: (node: AntTreeNode) => {
        setShowAddTagModal(true)
        currNodeId = tagsMap[node.props.eventKey].id
      }
    },
    {
      id: 2,
      name: '移除',
      callback: handleDelTag
    }
  ]

  const onSelect = (selectedKeys: string[]) => {
    let key = selectedKeys.pop()
    let tag = tagsMap[key]

    DL.bookmarks.filterByTag(tag)
    // console.log(tag)
  }

  const loop = (tags: Tag[]) => tags.map((tag) => {
    let key: string = tag.__key__ || '0'
    if (tag.children && tag.children.length) {
      return <TreeNode key={key} title={tag.name}>{loop(tag.children)}</TreeNode>
    }
    return <TreeNode key={key} title={tag.name}/>
  })

  const renderTree = () => {
    if (tagsTree.length) {
      return <Tree
        defaultExpandedKeys={['0']}
        onRightClick={({event, node}) => {activeContextMenu(event, node)}}
        onSelect={onSelect}
      >
        {loop(tagsTree)}
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
