import React, { Component } from 'react'
import './tags.scss'

class Tags extends Component {
  constructor () {
    super()
    this.state = {
      tags: [{
        id: 1,
        name: 'test1'
      }, {
        id: 2,
        name: 'test2'
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

  render () {
    let tags = this.state.tags.map(tag => {
      return <span styleName="tag" key={tag.id}>{tag.name}</span>
    })
    return <div styleName="tags">
      {tags}
    </div>
  }
}

export default Tags
