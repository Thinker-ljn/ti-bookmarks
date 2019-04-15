import DL, { DLBookmark, DLTag } from '@fe/src/plugins/data-layer'
import { useObjectState } from '@fe/src/plugins/hooks'
import { Col, Input, Row, Form } from 'antd'
import * as React from 'react'
import { useObservable } from 'rxjs-hooks';
import TagRow from './tag-row'
import { TagChangeEvent } from './tag-row/single-tag'

interface Props {
  currEdit?: DLBookmark,
  url?: string,
  name?: string,
}
interface Info {[key: string]: string}

export type AddBookmarkRef = React.MutableRefObject<{
  handleSubmit: () => void,
} | null>
const { forwardRef, useState, useImperativeHandle } = React

const addBookmarkModal = forwardRef((props: Props, ref) => {
  const currEdit = props.currEdit
  const initState = {
    name: currEdit ? currEdit.name : props.name || '',
    url: currEdit ? currEdit.url : props.url || '',
  }

  const [infos, setInfos] = useObjectState<Info>(initState)
  const [checkedTags, setCheckedTags] = useState<Set<number>>(new Set())
  const tags = useObservable<DLTag[]>(() => DL.tags.tree_, [])

  const tagsRelation = useObservable(() => DL.tags.kinship_, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value
    setInfos(key, value)
  }

  const onTagUpdate = (e: TagChangeEvent) => {
    const {tag, checked} = e
    let needDelete: number[] = []
    const newSet = new Set(checkedTags)
    newSet.add(tag.id)
    if (checked) {
      const relation = tagsRelation[tag.id]
      if (relation) { needDelete = needDelete.concat(relation.p, relation.c) }
    } else {
      needDelete = [tag.id]
    }
    for (const id of needDelete) {
      newSet.delete(id)
    }
    setCheckedTags(newSet)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit () {
      const checkeds = Array.from(checkedTags).join(',')
      const params = {
        name: infos.name,
        url: infos.url,
        tag_id: checkeds,
      }
      DL.bookmarks.post(params)
    },
  }));

  const rows = () => {
    const keys = Object.keys(infos)
    return keys.map((key: string) => {
      return (
        <Row type='flex' align='middle' style={{ marginBottom: 16 }} key={key}>
           <Col offset={1} span={3}>{key}:</Col>
           <Col span={18}>
             <Input value={infos[key]} onChange={e => handleChange(e, key)}></Input>
          </Col>
        </Row>
      )
    })
  }

  const topTags = tags[0] ? (tags[0].children || []) : []
  return (
    <Form>
      {rows()}
      <TagRow tags={topTags} checkedList={checkedTags} onTagUpdate={onTagUpdate}></TagRow>
    </Form>
  )
})

export default addBookmarkModal
