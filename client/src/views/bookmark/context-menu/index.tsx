import * as React from 'react'
import './index.scss'
import {on, off} from './trigger'

// import { tuple } from '@/util/type';

export type menuItem = {
  id: number,
  name: string,
  children?: menuItem[],
  callback: (payload: any, item: menuItem, index : number) => void
}
type ContextMenuProps = {
  data: menuItem[]
}
type ContextMenuState = {
  position: {
    x: number,
    y: number
  },
  display: 'none' | 'inline-block',
  payload: any
}
class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  private cmEle: HTMLUListElement = null
  constructor(props: ContextMenuProps) {
    super(props)
    this.state = {
      position: {
        x: 0,
        y: 0
      },
      display: 'none',
      payload: null
    }

    this.clickLi = this.clickLi.bind(this)
    this.activeMenu = this.activeMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  componentDidMount () {
    on(this.activeMenu)
  }

  componentWillUnmount () {
    off(this.activeMenu)
  }

  clickLi (item: menuItem, index: number) {
    if (item.callback && typeof item.callback === 'function') {
      item.callback(this.state.payload, item, index)
    }

    this.closeMenu()
  }

  activeMenu (e: React.MouseEvent, payload: any = null) {
    this.setState({
      position: {
        x: e.clientX,
        y: e.clientY
      },
      display: 'inline-block',
      payload: payload
    }, () => {
      if (this.cmEle) this.cmEle.focus()
    })
  }

  closeMenu () {
    this.setState({
      display: 'none'
    })
  }

  render () {
    const loop = (data: menuItem[]) => data.map((item, index) => {
      if (item.children && item.children.length) {
        return <ul key={item.id}>{loop(item.children)}</ul>
      }
      return <li key={item.id} onClick={() => {this.clickLi(item, index)}}>{item.name}</li>
    })

    const style = {
      left: this.state.position.x + 'px',
      top: this.state.position.y + 'px',
      display: this.state.display
    }

    return (
      <ul styleName="context-menu" style={style} tabIndex={-1}
        onBlur={this.closeMenu}
        ref={(el => {this.cmEle = el})}
      >
        {loop(this.props.data)}
      </ul>
    )
  }
}

export default ContextMenu
