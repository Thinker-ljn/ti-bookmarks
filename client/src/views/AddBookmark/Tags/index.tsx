import * as React from 'react'
import Tag, { tag, tagChangeEvent } from './Tag'
import './tags.scss'

type tagsState = {
  tags: tag[]
}
type tagsProps = {

}
class Tags extends React.Component<tagsProps, tagsState> {
  private tagContainer = React.createRef<HTMLDivElement>()
  constructor (props: tagsProps) {
    super(props)
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

  onWheel (e: React.WheelEvent) {
    let offset = e.deltaY / 5
    let target: HTMLDivElement = this.tagContainer.current
    target.scrollLeft += offset
  }

  updateSelectTag = (tag: tagChangeEvent) => {
    console.log(tag)
  }

  render () {
    let tagsJsx = this.state.tags.map(tag => {
      return <Tag onChange={this.updateSelectTag} tag={tag} key={tag.id}></Tag>
    })
    return <div styleName="tags-container" onWheel={e => this.onWheel(e)} ref={this.tagContainer}>
      {tagsJsx}
    </div>
  }
}

export default Tags
