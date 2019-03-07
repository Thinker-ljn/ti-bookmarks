import * as React from 'react'

import './index.scss'

import {Tag} from '@/plugin/data-layer'
import classNames from 'classnames'

export type TagChangeEvent = {
  tag: Tag,
  checked: boolean
}
type onChange = (e: TagChangeEvent) => void
type Props = {
  tag: Tag,
  checkedList: Set<number>,
  onChange?: onChange
}

interface HasChildTag extends Tag {
  children: Tag[]
}

const { useState } = React
export default function SingleTag (props: Props) {
  // let [checked, setChecked] = useState(false)
  let [expended, setExpended] = useState(false)

  const onChange: onChange = (e) => {
    if (props.onChange) props.onChange(e)
  }

  const onClick = () => {
    let tag = props.tag
    let newStatus = !checked
    // setChecked(newStatus)
    onChange({
      tag: tag,
      checked: newStatus
    })
  }

  const doExpend = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpended(!expended)
  }

  // const onChildChange = (e: TagChangeEvent) => {
  //   onChange(e)
  // }

  let tag = props.tag

  let checked = props.checkedList.has(tag.id)
  let styles = (checked ? 'checked' : '') + ' tag'

  const hasChildren = (tag: Tag): tag is HasChildTag => {
    return Array.isArray(tag.children) && tag.children.length > 0
  }

  let expendedStyle = classNames({'has-children': hasChildren(tag), expended: expended})
  let tagJsx = <div styleName={styles} title={tag.name} onClick={onClick}>
              <span styleName={expendedStyle} onClick={doExpend}></span>
              <span>{tag.name}</span>
            </div>

  if (hasChildren(tag)) {
    let children = tag.children.map(_tag => <SingleTag tag={_tag} checkedList={props.checkedList} onChange={onChange} key={_tag.id}></SingleTag>)
    let childrenRender = expended ? <div styleName="tag-children">{children}<span styleName="collapse" onClick={doExpend}></span></div> : ''
    return <div styleName="tag-wrapper" key={tag.id}>
      {tagJsx}
      {childrenRender}
    </div>
  } else {
    return tagJsx
  }
}
