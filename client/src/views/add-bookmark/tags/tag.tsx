import * as React from 'react'
import classNames from 'classnames'

import './tags.scss'

export type tag = {
  id: number,
  name: string,
  children?: tag[]
}

export type tagChangeEvent = {
  tag: tag,
  checked: boolean
}
type TagProps = {
  tag: tag,
  onChange?: (e: tagChangeEvent) => void
}
type TagState = {
  checked: boolean,
  expended: boolean
}

class Tag extends React.Component<TagProps, TagState> {
  constructor (props: TagProps) {
    super(props)

    this.state = {
      checked: false,
      expended: false
    }
  }

  onClick = () => {
    let checked = !this.state.checked
    this.setState({
      checked: checked
    })
    let tag = this.props.tag
    this.props.onChange({
      tag: tag,
      checked: checked
    })
  }

  doExpend = (e: React.MouseEvent) => {
    e.stopPropagation()
    let {expended} = this.state
    this.setState({
      expended: !expended
    })
  }

  onChildChange = (tag: tagChangeEvent) => {
    this.setState({
      checked: false
    })
    this.props.onChange(tag)
  }

  render () {
    let tag = this.props.tag
    let {checked, expended} = this.state
    let styles = (checked ? 'checked' : '') + ' tag'

    let hasChild = tag.children && tag.children.length
    let expendedStyle = classNames({'has-children': hasChild, expended: expended})
    let tagJsx = <div styleName={styles} title={tag.name} onClick={this.onClick}>
                <span styleName={expendedStyle} onClick={this.doExpend}></span>
                <span>{tag.name}</span>
              </div>

    if (hasChild) {
      let children = tag.children.map(_tag => <Tag tag={_tag} onChange={this.onChildChange} key={_tag.id}></Tag>)
      let childrenRender = expended ? <div styleName="tag-children">{children}<span styleName="collapse" onClick={this.doExpend}></span></div> : ''
      return <div styleName="tag-wrapper" key={tag.id}>
        {tagJsx}
        {childrenRender}
      </div>
    } else {
      return tagJsx
    }
  }
}

export default Tag
