import { Icon, Input } from 'antd'
import * as React from 'react';
import { f, stop } from '@fe/src/utils';
import { useBooleanState } from '@fe/src/plugins/hooks';
import classnames from 'classnames'
import './index.scss'
import { PendingStatus } from '@fe/src/plugins/data-layer/core/types';

export interface Payload {
  id: number
  name: string
  __status__?: PendingStatus
}
interface Props {
  payload?: Payload
  onUpdate: (payload: Payload) => void
  onDelete: (id: number) => void
}
type Noop = () => void
type Status = 'normal' | 'editing' | 'empty'

interface NormalProps {
  title: string
  isRoot: boolean
  toEdit: Noop
  toDelete: Noop
}

interface EditingProps {
  title: string
  toClose: Noop
  toSubmit: (name: string) => void
}

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

const NormalTitle = (props: NormalProps) => {
  return <span styleName='title'>
    {props.title}
    <span styleName={classnames(['hover', {'is-root': props.isRoot}])} onClick={stop()}>
      <Icon type='edit' onClick={props.toEdit}></Icon>
      <DeleteIcon onClick={props.toDelete}></DeleteIcon>
    </span>
  </span>
}

const EmptyTitle = (props: {toEdit: Noop}) => {
  return <span onClick={stop()}>
    <Icon type='plus-circle' onClick={props.toEdit}></Icon>
  </span>
}

const EditingTitle = (props: EditingProps) => {
  const [title, setTitle] = React.useState(props.title)
  return <span onClick={stop()}>
    <Input value={title} onChange={(e) => {setTitle(e.target.value)}}></Input>
    <Icon type='check' onClick={f(props.toSubmit, title)}></Icon>
    <Icon type='close' onClick={props.toClose}></Icon>
  </span>
}

export default function EditableTitle (props: Props) {
  const {onDelete, onUpdate, payload} = props
  const {id, name: initialName} = payload || {id: 0, name: ''}
  const isNormalMode = !!payload
  const isRoot = !!payload && payload.id === 0
  const initialStatus = isNormalMode ? 'normal' : 'empty'
  const [status, setStatus] = React.useState<Status>(initialStatus)

  const toEdit = f(setStatus, 'editing')
  const toDelete = f(onDelete, id)
  const toClose = f(setStatus, initialStatus)

  const toSubmit = (name: string) => {
    onUpdate({
      id,
      name
    })
    toClose()
  }

  switch (status) {
    case 'empty': return <EmptyTitle toEdit={toEdit}></EmptyTitle>
    case 'editing': return <EditingTitle title={initialName} toSubmit={toSubmit} toClose={toClose}></EditingTitle>
    default: return <NormalTitle title={initialName} toEdit={toEdit} toDelete={toDelete} isRoot={isRoot}></NormalTitle>
  }
}
