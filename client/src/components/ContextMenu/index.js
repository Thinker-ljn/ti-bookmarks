import React, { Component } from 'react'

import './index.scss'
import {on, off} from './trigger'

class ContextMenu extends Component {
  constructor(props) {
    super(props)
    this.cmEle = null
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

  clickLi (item, index) {
    if (item.callback && typeof item.callback === 'function') {
      item.callback(this.state.payload, item, index)
    }

    this.closeMenu()
  }

  activeMenu (e, payload = null) {
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
    const loop = data => data.map((item, index) => {
      if (item.children && item.children.length) {
        return <ul key={item.id}>{arguments.callee(item.children)}</ul>
      }
      return <li key={item.id} onClick={() => {this.clickLi(item, index)}}>{item.name}</li>
    })

    const style = {
      left: this.state.position.x + 'px',
      top: this.state.position.y + 'px',
      display: this.state.display
    }
    return (
      <ul styleName="context-menu" style={style} tabIndex="-1"
        onBlur={this.closeMenu}
        ref={(el => {this.cmEle = el})}
      >
        {loop(this.props.data)}
      </ul>
    )
  }
}

export default ContextMenu
