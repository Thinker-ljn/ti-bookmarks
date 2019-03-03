import * as React from 'react'
import { Bookmark } from '@/plugin/data-layer'

import './index.scss'

type propsType = {
  bookmark: Bookmark
}
function SingleBookmark (props: propsType) {
  const bk = props.bookmark
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

export default SingleBookmark
