import { Icon } from 'antd';
import * as React from 'react';
import { useBooleanState } from '../plugins/hooks';

const DeleteIcon = (props: {onClick?: React.MouseEventHandler<HTMLElement>}) => {
  const doubleChecked = useBooleanState(false)
  const doDelete = (e: React.MouseEvent<HTMLElement>) => {
    if (!doubleChecked.value) {
      doubleChecked.toTrue()
      return
    }
    if (props.onClick) {
      props.onClick(e)
    }
  }
  const style = {
    color: doubleChecked.value ? '#ff6600' : '#999'
  }
  return <Icon type='delete' style={style} onClick={doDelete}></Icon>
}

export default DeleteIcon
