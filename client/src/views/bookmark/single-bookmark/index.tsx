import * as React from 'react'
import * as PropTypes from 'prop-types'

import './index.scss'
type bookmark = {
  id: number,
  name: string,
  url: string
}

type propsType = {
  bookmark: bookmark
}
class SingleBookmark extends React.Component<propsType, null> {
  static propTypes = {
    bookmark: PropTypes.object
  }

  constructor(props: propsType) {
    super(props)
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
