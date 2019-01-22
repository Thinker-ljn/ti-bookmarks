import React, { Component } from 'react'
import './tags.scss'

class Tags extends Component {
  constructor () {
    super()
    this.state = {
      tags: [{
        id: 1,
        name: '学习',
        children: [{
          id: 7,
          name: '学习1'
        }, {
          id: 8,
          name: '学习2',
          children: [{
            id: 9,
            name: '学习21'
          }, {
            id: 10,
            name: '学习22'
          }]
        }]
      }, {
        id: 2,
        name: '音乐鉴赏'
      }, {
        id: 3,
        name: 'test3'
      }, {
        id: 4,
        name: 'test4'
      }, {
        id: 5,
        name: 'test5'
      }, {
        id: 6,
        name: 'test6'
      }]
    }
  }

  onWheel (e) {
    let offset = e.deltaY / 5
    let target = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target
    target.scrollLeft += offset
  }

  render () {
    let renderTag = function (tag) {
      if (tag.children && tag.children.length) {
        return <div styleName="tag-wrapper">
          <span styleName="tag" key={tag.id} title={tag.name}>{tag.name}</span>
          <div styleName="tag-wrapper">{tag.children.map(_tag => renderTag(_tag))}</div>
        </div>
      } else {
        return <span styleName="tag" key={tag.id} title={tag.name}>{tag.name}</span>
      }
    }
    let tagsJsx = this.state.tags.map(tag => {
      return renderTag(tag)
    })
    return <div styleName="tags" onWheel={e => this.onWheel(e)}>
      {tagsJsx}
    </div>
  }
}

export default Tags
