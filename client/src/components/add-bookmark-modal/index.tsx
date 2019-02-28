import * as React from 'react'
import { Layout, Input, Row, Col, Button } from 'antd'
import TagRow from './tag-row'
import { TagChangeEvent } from './tag-row/single-tag'
import DL, {Tag} from '@/plugin/data-layer'
import { useObservable } from 'rxjs-hooks';
import './index.scss'

const { Content, Header, Footer } = Layout

type Props = {
  url: string,
  name: string
}
type Info = {[key: string]: string}
export default function AddBookmarkModal (props: Props) {
  let { useState } = React
  let [info, setInfo] = useState<Info>(props)
  let [checkedTags, setCheckedTags] = useState<Set<number>>(new Set)
  let tags = useObservable<Tag[]>(() => DL.tags.get('tree'), [])

  let tagsRelation = useObservable(() => DL.tags.get('relation'), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    let value = e.target.value
    info[key] = value
    setInfo(info)
  }

  const handleSubmit = () => {

  }

  const handleClose = () => {
    window.close()
  }

  const onTagUpdate = (e: TagChangeEvent) => {
    let {tag, checked} = e
    let needDelete: number[] = []
    let newSet = new Set(checkedTags)
    if (checked) {
      let relation = tagsRelation[tag.id]
      if (relation) needDelete = needDelete.concat(relation.p, relation.c)
    } else {
      needDelete = [tag.id]
    }
    console.log('needDelete', needDelete)
    for (let id of needDelete) {
      newSet.delete(id)
    }
    setCheckedTags(newSet)
  }

  const rows = () => {
    let keys = Object.keys(info)
    return keys.map((key: string) => {
      return (
        <Row type="flex" align="middle" style={{ marginBottom: 16 }} key={key}>
           <Col offset={1} span={3}>{key}:</Col>
           <Col span={18}>
             <Input value={info[key]} onChange={e => handleChange(e, key)}></Input>
          </Col>
        </Row>
      )
    })
  }

  return (
    <Layout styleName="layout">
      <Layout styleName="inner-layout">
        <Header>
          <h3 style={{ color: '#eee' }}>填写标签信息</h3>
        </Header>
        <Content styleName="content">
          {rows()}
          <TagRow tags={tags[0] ? tags[0].children : []} onTagUpdate={onTagUpdate}></TagRow>
        </Content>
        <Footer styleName="footer">
          <Button type="primary" onClick={handleSubmit}>提交</Button>
          <Button style={{ marginLeft: 16 }} onClick={handleClose}>关闭</Button>
        </Footer>
      </Layout>
    </Layout>
  )
}
