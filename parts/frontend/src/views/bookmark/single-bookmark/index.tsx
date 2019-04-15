import { DLBookmark } from '@fe/src/plugins/data-layer'
import { Icon } from 'antd';
import * as React from 'react'
import './index.scss'

interface Props {
  bookmark: DLBookmark,
  editFn: (bookmark: DLBookmark) => void,
}
function SingleBookmark (props: Props) {
  const bk = props.bookmark
  const editFn = props.editFn
  const favicon = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(bk.url)
  return (
    <li styleName='bookmark'>
      <a styleName='name' target='_blank' rel='noopener noreferrer' // https://mathiasbynens.github.io/rel-noopener/
        href={bk.url} title={bk.name}
      >
        <img src={favicon} styleName='favicon'/>
        <span>{bk.name}</span>
        {bk.__status__ ? <span>{bk.__status__}</span> : '' }
      </a>
      <span styleName='edit-icon' onClick={() => editFn(bk)}>
        <Icon type='edit'></Icon>
      </span>
    </li>
  )
}

export default SingleBookmark
