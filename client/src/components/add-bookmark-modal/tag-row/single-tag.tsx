import * as React from 'react'

import './index.scss'

import {Tag} from '@/plugin/data-layer'
import classNames from 'classnames'

export type TagChangeEvent = {
  tag: Tag,
  checked: boolean
}

type Props = {
  tag: Tag,
  checkedList: Set<number>,
  onChange?: (e: TagChangeEvent) => void
}

const { useState } = React
export default function SingleTag (props: Props) {
  // let [checked, setChecked] = useState(false)
  let [expended, setExpended] = useState(false)

  const onClick = () => {
    let tag = props.tag
    let newStatus = !checked
    // setChecked(newStatus)
    props.onChange({
      tag: tag,
      checked: newStatus
    })
  }

  const doExpend = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpended(!expended)
  }

  const onChildChange = (e: TagChangeEvent) => {
    props.onChange(e)
  }

  let tag = props.tag

  let checked = props.checkedList.has(tag.id)
  let styles = (checked ? 'checked' : '') + ' tag'

  let hasChild = tag.children && tag.children.length
  let expendedStyle = classNames({'has-children': hasChild, expended: expended})
  let tagJsx = <div styleName={styles} title={tag.name} onClick={onClick}>
              <span styleName={expendedStyle} onClick={doExpend}></span>
              <span>{tag.name}</span>
            </div>

  if (hasChild) {
    let children = tag.children.map(_tag => <SingleTag tag={_tag} checkedList={props.checkedList} onChange={onChildChange} key={_tag.id}></SingleTag>)
    let childrenRender = expended ? <div styleName="tag-children">{children}<span styleName="collapse" onClick={doExpend}></span></div> : ''
    return <div styleName="tag-wrapper" key={tag.id}>
      {tagJsx}
      {childrenRender}
    </div>
  } else {
    return tagJsx
  }
}
