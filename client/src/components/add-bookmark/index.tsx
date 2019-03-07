import * as React from 'react'
import { Layout, Input, Row, Col } from 'antd'
import TagRow from './tag-row'
import { TagChangeEvent } from './tag-row/single-tag'
import DL, { DLTag } from '@/plugin/data-layer'
import { useObservable } from 'rxjs-hooks';
import { useObjectState } from '@/plugin/hooks'

type Props = {
  url?: string,
  name?: string
}
type Info = {[key: string]: string}
const { forwardRef, useState, useImperativeHandle } = React

const AddBookmarkModal = forwardRef((props: Props, ref) => {
  let initState = {
    name: props.name || '',
    url: props.url || ''
  }

  let [infos, setInfos] = useObjectState<Info>(initState)
  let [checkedTags, setCheckedTags] = useState<Set<number>>(new Set)
  let tags = useObservable<DLTag[]>(() => DL.tags.get('tree'), [])

  let tagsRelation = useObservable(() => DL.tags.get('relation'), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    let value = e.target.value
    setInfos(key, value)
  }

  const onTagUpdate = (e: TagChangeEvent) => {
    let {tag, checked} = e
    let needDelete: number[] = []
    let newSet = new Set(checkedTags)
    newSet.add(tag.id)
    if (checked) {
      let relation = tagsRelation[tag.id]
      if (relation) needDelete = needDelete.concat(relation.p, relation.c)
    } else {
      needDelete = [tag.id]
    }
    for (let id of needDelete) {
      newSet.delete(id)
    }
    setCheckedTags(newSet)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit () {
      let checkeds = Array.from(checkedTags).join(',')
      let params = {
        name: infos.name,
        url: infos.url,
        tag_id: checkeds
      }
      DL.bookmarks.post(params)
    }
  }));

  const rows = () => {
    let keys = Object.keys(infos)
    return keys.map((key: string) => {
      return (
        <Row type="flex" align="middle" style={{ marginBottom: 16 }} key={key}>
           <Col offset={1} span={3}>{key}:</Col>
           <Col span={18}>
             <Input value={infos[key]} onChange={e => handleChange(e, key)}></Input>
          </Col>
        </Row>
      )
    })
  }

  let topTags = tags[0] ? (tags[0].children || []) : []
  return (
    <Layout>
      {rows()}
      <TagRow tags={topTags} checkedList={checkedTags} onTagUpdate={onTagUpdate}></TagRow>
    </Layout>
  )
})

export default AddBookmarkModal
