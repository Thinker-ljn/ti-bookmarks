import * as React from 'react'
import './index.scss'
import {off, on} from './trigger'

// import { tuple } from '@fe/src/util/type';

export interface MenuItem {
  id: number,
  name: string,
  children?: MenuItem[],
  callback: (payload: any, item: MenuItem, index: number) => void,
}
export type Menu = MenuItem[]
interface ContextMenuProps {
  data: MenuItem[],
}
interface ContextMenuState {
  position: {
    x: number,
    y: number,
  },
  display: 'none' | 'inline-block',
  payload: any,
}
class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
  private cmEle: HTMLUListElement | null = null
  constructor (props: ContextMenuProps) {
    super(props)
    this.state = {
      position: {
        x: 0,
        y: 0,
      },
      display: 'none',
      payload: null,
    }

    this.clickLi = this.clickLi.bind(this)
    this.activeMenu = this.activeMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  public componentDidMount () {
    on(this.activeMenu)
  }

  public componentWillUnmount () {
    off(this.activeMenu)
  }

  public clickLi (item: MenuItem, index: number) {
    if (item.callback && typeof item.callback === 'function') {
      item.callback(this.state.payload, item, index)
    }

    this.closeMenu()
  }

  public activeMenu (e: React.MouseEvent, payload: any = null) {
    this.setState({
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      display: 'inline-block',
      payload,
    }, () => {
      if (this.cmEle) { this.cmEle.focus() }
    })
  }

  public closeMenu () {
    this.setState({
      display: 'none',
    })
  }

  public render () {
    const loop = (data: MenuItem[]) => data.map((item, index) => {
      if (item.children && item.children.length) {
        return <ul key={item.id}>{loop(item.children)}</ul>
      }
      return <li key={item.id} onClick={() => {this.clickLi(item, index)}}>{item.name}</li>
    })

    const style = {
      left: this.state.position.x + 'px',
      top: this.state.position.y + 'px',
      display: this.state.display,
    }

    return (
      <ul styleName='context-menu' style={style} tabIndex={-1}
        onBlur={this.closeMenu}
        ref={(el => {this.cmEle = el})}
      >
        {loop(this.props.data)}
      </ul>
    )
  }
}

export default ContextMenu
