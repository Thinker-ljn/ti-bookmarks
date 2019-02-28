import * as React from 'react'
import SingleTag, { TagChangeEvent } from './single-tag'
import './index.scss'
import {Tag} from '@/plugin/data-layer'

type Props = {
  tags: Tag[],
  onTagUpdate?: (tag: TagChangeEvent) => void
}

export default function TagRow (props: Props) {
  let tagContainer = React.createRef<HTMLDivElement>()
  const onWheel = (e: React.WheelEvent) => {
    let offset = e.deltaY / 5
    let target: HTMLDivElement = tagContainer.current
    target.scrollLeft += offset
  }

  const updateSelectTag = (tag: TagChangeEvent) => {
    props.onTagUpdate(tag)
  }

  let tagsJsx = props.tags.map(tag => {
    return <SingleTag onChange={updateSelectTag} tag={tag} key={tag.id}></SingleTag>
  })
  return <div styleName="tags-container" onWheel={onWheel} ref={tagContainer}>
    {tagsJsx}
  </div>
}
