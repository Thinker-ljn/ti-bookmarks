import { Layout, Tree } from 'antd'
import * as React from 'react'
import './index.scss'
import { CreateTag, UpdateTag } from '@interfaces'
import DL, {DLTag} from '@fe/src/plugins/data-layer'
import { Dictionary } from 'lodash';
import { useObservable } from 'rxjs-hooks'
import { NormalTitle } from '@fe/src/components/editable-title';
import { f } from '@fe/src/utils';
import AddTagModal from './add-tag-modal';
import { useBooleanState } from '@fe/src/plugins/hooks';

const { Sider } = Layout
const { TreeNode } = Tree

type ModalOk = ((name: string) => void) | undefined
type Submit = (id: number, name: string) => void 
export default function AppSider () {
  const tagsTree: DLTag[] = useObservable(() => DL.tags.tree_, [])
  const tagsMap: Dictionary<DLTag> = useObservable(() => DL.tags.map_, {})
  const [modalOk, setModalOk] = React.useState<ModalOk>(undefined)
  const modalVisible = useBooleanState(false)
  const createTag = (id: number, name: string) => {
    const params: CreateTag = {
      name,
      parent_id: id,
    }
    DL.tags.post(params)
  }

  const updateTag = (id: number, name: string) => {
    const params: UpdateTag = {name, id}
    DL.tags.patch(params)
  }

  const delTag = (id: number) => {
    DL.tags.delete({id})
  }

  const onSelect = (selectedKeys: string[]) => {
    const key = selectedKeys.pop()
    if (!key) { return }
    const tag = tagsMap[key]

    DL.bookmarks.filterByTag(tag)
  }

  // ---- render ----
  const renderTitle = (tag: DLTag) => {
    const openTagModel = (action: Submit) => {
      setModalOk(() => {
        return (name: string) => {
          if (!name) {
            return
          }
          action(tag.id, name)
          setModalOk(undefined)
          modalVisible.toFalse()
        }
      })
      modalVisible.toTrue()
    }
    return <NormalTitle 
      title={tag.name} 
      isRoot={!tag.id} 
      toDelete={f(delTag, tag.id)} addChild={f(openTagModel, createTag)} toEdit={f(openTagModel, updateTag)}></NormalTitle>
  }

  const loop = (tags: DLTag[]) => {
    const children = tags.map((tag) => {
      const key = tag.__key__
      return <TreeNode key={key} title={renderTitle(tag)}>
        {(tag.children && tag.children.length) ? loop(tag.children) : ''}
      </TreeNode>
    })
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
      <AddTagModal onHide={() => {modalVisible.toFalse()}} onOk={modalOk} visible={modalVisible.value} ></AddTagModal>
      {renderTree()}
    </Sider>
  )
}
