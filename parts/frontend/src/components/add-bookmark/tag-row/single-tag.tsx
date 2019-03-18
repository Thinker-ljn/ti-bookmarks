import * as React from 'react'

import './index.scss'

import {DLTag} from '@/plugins/data-layer'
import classNames from 'classnames'

export interface TagChangeEvent {
  tag: DLTag,
  checked: boolean,
}
type OnChange = (e: TagChangeEvent) => void
interface Props {
  tag: DLTag,
  checkedList: Set<number>,
  onChange?: OnChange,
}

interface HasChildDLTag extends DLTag {
  children: DLTag[]
}

const { useState } = React
export default function SingleDLTag (props: Props) {
  const tag = props.tag
  const [expended, setExpended] = useState(false)

  const onChange: OnChange = (e) => {
    if (props.onChange) { props.onChange(e) }
  }

  const onClick = () => {
    const newStatus = !checked
    // setChecked(newStatus)
    onChange({
      tag,
      checked: newStatus,
    })
  }

  const doExpend = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpended(!expended)
  }

  const checked = props.checkedList.has(tag.id)
  const styles = (checked ? 'checked' : '') + ' tag'

  const hasChildren = (theCheckingTag: DLTag): theCheckingTag is HasChildDLTag => {
    return Array.isArray(theCheckingTag.children) && theCheckingTag.children.length > 0
  }

  const expendedStyle = classNames({'has-children': hasChildren(tag), 'expended': expended})
  const tagJsx = <div styleName={styles} title={tag.name} onClick={onClick}>
              <span styleName={expendedStyle} onClick={doExpend}></span>
              <span>{tag.name}</span>
            </div>

  if (hasChildren(tag)) {
    const children = tag.children.map(ctag => <SingleDLTag
                                                tag={ctag}
                                                checkedList={props.checkedList}
                                                onChange={onChange}
                                                key={ctag.id}
                                              ></SingleDLTag>)
    const childrenRender = expended ? <div styleName='tag-children'>
                                        {children}<span styleName='collapse' onClick={doExpend}></span>
                                      </div>
                                    : ''
    return <div styleName='tag-wrapper' key={tag.id}>
      {tagJsx}
      {childrenRender}
    </div>
  } else {
    return tagJsx
  }
}
