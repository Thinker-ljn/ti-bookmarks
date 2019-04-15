import { DLTag } from '@fe/src/plugins/data-layer';
import * as React from 'react'
import './index.css'
import SingleTag, { TagChangeEvent } from './single-tag'
import { Col, Row } from 'antd';

type onTagUpdate = (tag: TagChangeEvent) => void
interface Props {
  tags: DLTag[],
  checkedList: Set<number>,
  onTagUpdate?: onTagUpdate,
}

export default function TagRow (props: Props) {
  const tagContainer = React.createRef<HTMLDivElement>()
  const onWheel = (e: React.WheelEvent) => {
    console.info(e.target)
    const offset = e.deltaY / 5
    const target: HTMLDivElement | null = tagContainer.current
    if (target) { target.scrollLeft += offset }
  }

  const updateSelectTag = (tag: TagChangeEvent) => {
    if (props.onTagUpdate) { props.onTagUpdate(tag) }
  }

  const tagsJsx = props.tags.map(tag => {
    return <SingleTag checkedList={props.checkedList} onChange={updateSelectTag} tag={tag} key={tag.id}></SingleTag>
  })
  
  return <Row type='flex' align='middle' style={{ marginBottom: 16 }} key='tag'>
    <Col offset={1} span={3}>标签:</Col>
    <Col span={18}>
      <div styleName='tags-container' onWheel={onWheel} ref={tagContainer}>
        {tagsJsx}
      </div>
    </Col>
  </Row>
}
