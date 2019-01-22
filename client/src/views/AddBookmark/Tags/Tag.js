import React, { Component } from 'react'
import './tags.scss'
class Tag extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expended: false
    }
  }

  onClick () {
    let newStatus = !this.state.expended
    this.setState({expended: newStatus})
  }

  render () {
    let tag = this.props.tag
    let expended = this.state.expended
    let tagJsx = <span styleName="tag" title={tag.name} onClick={e => this.onClick(e)}>{tag.name}</span>
    if (expended && tag.children && tag.children.length) {
      return <div styleName="tag-wrapper" key={tag.id}>
        {tagJsx}
        <div styleName="tag-children">{tag.children.map(_tag => <Tag tag={_tag} key={_tag.id}></Tag>)}</div>
      </div>
    } else {
      return tagJsx
    }
  }
}

export default Tag
