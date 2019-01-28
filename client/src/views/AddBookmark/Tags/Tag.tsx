import * as React from 'react'
import classNames from 'classnames'

import './tags.scss'

type tag = {
  id: number,
  name: string,
  children?: tag[]
}
type TagProps = {
  tag: tag
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
    let {checked} = this.state
    this.setState({
      checked: !checked
    })
  }

  doExpend = (e: React.MouseEvent) => {
    e.stopPropagation()
    let {expended} = this.state
    this.setState({
      expended: !expended
    })
  }

  render () {
    let tag = this.props.tag
    let {checked, expended} = this.state
    let styles = (checked ? 'checked' : '') + ' tag'

    let hasChild = tag.children && tag.children.length
    let expendedStyle = classNames({'has-children': hasChild, expended: expended})
    let tagJsx = <div styleName={styles} title={tag.name} onClick={this.onClick}>
                <span>{tag.name}</span>
                <span styleName={expendedStyle} onClick={this.doExpend}></span>
              </div>

    if (hasChild) {
      let children = expended ? <div styleName="tag-children">{tag.children.map(_tag => <Tag tag={_tag} key={_tag.id}></Tag>)}</div> : ''
      return <div styleName="tag-wrapper" key={tag.id}>
        {tagJsx}
        {children}
      </div>
    } else {
      return tagJsx
    }
  }
}

export default Tag
