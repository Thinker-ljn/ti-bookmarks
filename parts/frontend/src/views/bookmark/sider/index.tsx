import { Layout, Tree } from 'antd'
import * as React from 'react'
import './index.scss'
import { CreateTag, UpdateTag } from '@interfaces'
import DL, {DLTag} from '@fe/src/plugins/data-layer'
import { Dictionary } from 'lodash';
import { useObservable } from 'rxjs-hooks'
import EditableTitle, { Payload } from '@fe/src/components/editable-title';

const { Sider } = Layout
const { TreeNode } = Tree

export default function AppSider () {
  const tagsTree: DLTag[] = useObservable(() => DL.tags.tree_, [])
  const tagsMap: Dictionary<DLTag> = useObservable(() => DL.tags.map_, {})

  const addTag = (payload: Payload) => {
    const params: CreateTag = {
      name: payload.name,
      parent_id: payload.id,
    }
    DL.tags.post(params)
  }

  const updateTag = (payload: UpdateTag) => {
    DL.tags.patch(payload)
  }

  const delTag = (id: number) => {
    DL.tags.delete({id})
  }

  const onSelect = (selectedKeys: string[]) => {
    const key = selectedKeys.pop()
    if (!key) { return }
    const tag = tagsMap[key]

    DL.bookmarks.filterByTag(tag)
    // console.log(tag)
  }

  // ---- render ----
  const renderTitle = (tag?: DLTag) => {
    const onUpdate = tag ? updateTag :  addTag
    return <EditableTitle payload={tag} onDelete={delTag} onUpdate={onUpdate}></EditableTitle>
  }

  const loop = (tags: DLTag[], parent?: DLTag) => {
    const children = tags.map((tag) => {
      const key = tag.__key__
      return <TreeNode key={key} title={renderTitle(tag)}>{loop(tag.children || [], tag)}</TreeNode>
      // if (tag.children && tag.children.length) {
      // }
      // return <TreeNode key={key} title={renderTitle(tag)}/>
    })

    if (parent) {
      children.push(
        <TreeNode key={'add-' + parent.__key__} title={renderTitle()}></TreeNode>
      )
    }
    return children
  }

  const renderTree = () => {
    if (tagsTree.length) {
      return <Tree
        defaultExpandedKeys={['0-0']}
        onSelect={onSelect}
      >
        {loop(tagsTree)}
      </Tree>
    }
  }

  return (
    <Sider styleName='app-sider' width='300'>
      {renderTree()}
    </Sider>
  )
}
