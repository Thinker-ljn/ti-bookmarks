import { Icon, Layout, message, Modal, Tree } from 'antd'
import * as React from 'react'
import ContextMenu, { Menu } from '../context-menu'
import AddTagModal from './add-tag-modal'
import './index.scss'

import DL, {DLTag} from '@fe/src/plugins/data-layer'
import { AntTreeNode } from 'antd/lib/tree'
import { Dictionary } from 'lodash';
import { useObservable } from 'rxjs-hooks'
import { emit } from '../context-menu/trigger'

const { Sider } = Layout
const { TreeNode } = Tree

function activeContextMenu (e: React.MouseEventHandler<any>, node: AntTreeNode) {
  emit(e, node)
}

let currNodeId: number = 0
export default function AppSider () {
  const { useState } = React
  const tagsTree: DLTag[] = useObservable(() => DL.tags.tree_, [])
  const tagsMap: Dictionary<DLTag> = useObservable(() => DL.tags.map_, {})
  const [showAddTagModal, setShowAddTagModal] = useState(false)

  const addTag = (name: string) => {
    const params = {
      name,
      parent_id: currNodeId,
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
        const key = node.props.eventKey
        if (!key || !tagsMap[key]) { return }
        const tag: DLTag = tagsMap[key]
        DL.tags.delete(tag)
      },
    })
  }

  const menu: Menu = [
    {
      id: 1,
      name: '添加',
      callback: (node: AntTreeNode) => {
        const key = node.props.eventKey
        if (!key) { return }
        currNodeId = tagsMap[key] ? tagsMap[key].id : 0
        setShowAddTagModal(true)
      },
    },
    {
      id: 2,
      name: '移除',
      callback: handleDelTag,
    },
  ]

  const onSelect = (selectedKeys: string[]) => {
    const key = selectedKeys.pop()
    if (!key) { return }
    const tag = tagsMap[key]

    DL.bookmarks.filterByTag(tag)
    // console.log(tag)
  }

  const loop = (tags: DLTag[], addKey?: string) => {
    const children = tags.map((tag) => {
      const key = tag.__key__
      if (tag.children && tag.children.length) {
        return <TreeNode key={key} title={tag.name}>{loop(tag.children, tag.__key__)}</TreeNode>
      }
      return <TreeNode key={key} title={tag.name}/>
    })

    if (children.length && addKey) { children.push(<TreeNode key={addKey} title={
      <Icon type='plus-circle'></Icon>
    }></TreeNode>)
    }
    return children
  }

  const renderTree = () => {
    if (tagsTree.length) {
      return <Tree
        defaultExpandedKeys={['0-0']}
        onRightClick={({event, node}) => {activeContextMenu(event, node)}}
        onSelect={onSelect}
      >
        {loop(tagsTree)}
      </Tree>
    }
  }

  return (
    <Sider styleName='app-sider' width='300'>
      <AddTagModal visible={showAddTagModal} onHide={() => setShowAddTagModal(false)} onOk={addTag}></AddTagModal>
      <ContextMenu data={menu}></ContextMenu>
      {renderTree()}
    </Sider>
  )
}
