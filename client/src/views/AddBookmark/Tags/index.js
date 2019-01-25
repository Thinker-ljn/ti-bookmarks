import React, { Component } from 'react'
import Tag from './Tag.tsx'
import './tags.scss'

class Tags extends Component {
  constructor () {
    super()
    this.tagContainer = React.createRef()
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
    let target = this.tagContainer.current
    target.scrollLeft += offset
  }

  render () {
    let tagsJsx = this.state.tags.map(tag => {
      return <Tag tag={tag} key={tag.id}></Tag>
    })
    return <div styleName="tags" onWheel={e => this.onWheel(e)} ref={this.tagContainer}>
      {tagsJsx}
    </div>
  }
}

export default Tags
