import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.scss'

class SingleBookmark extends Component {
  static propTypes = {
    bookmark: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render () {
    const bk = this.props.bookmark
    const favicon = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(bk.url)
    return (
      <li styleName="bookmark">
        <img src={favicon} styleName="favicon"/>
        <a styleName="name" target="_blank" rel="noopener noreferrer" // https://mathiasbynens.github.io/rel-noopener/
          href={bk.url} title={bk.name}
        >{bk.name}</a>
      </li>
    )
  }
}

export default SingleBookmark
