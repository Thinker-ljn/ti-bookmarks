import * as React from 'react'
import SingleTag, { TagChangeEvent } from './single-tag'
import './index.scss'
import { DLTag } from '@/plugin/data-layer';

type onTagUpdate = (tag: TagChangeEvent) => void
type Props = {
  tags: DLTag[],
  checkedList: Set<number>,
  onTagUpdate?: onTagUpdate
}

export default function TagRow (props: Props) {
  let tagContainer = React.createRef<HTMLDivElement>()
  const onWheel = (e: React.WheelEvent) => {
    let offset = e.deltaY / 5
    let target: HTMLDivElement | null = tagContainer.current
    if (target) target.scrollLeft += offset
  }

  const updateSelectTag = (tag: TagChangeEvent) => {
    if (props.onTagUpdate) props.onTagUpdate(tag)
  }

  let tagsJsx = props.tags.map(tag => {
    return <SingleTag checkedList={props.checkedList} onChange={updateSelectTag} tag={tag} key={tag.id}></SingleTag>
  })
  return <div styleName="tags-container" onWheel={onWheel} ref={tagContainer}>
    {tagsJsx}
  </div>
}
