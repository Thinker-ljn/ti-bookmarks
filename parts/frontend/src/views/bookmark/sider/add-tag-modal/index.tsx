import * as React from 'react'

import * as PropTypes from 'prop-types'
import './index.scss'

import { Input, Modal } from 'antd'

interface Props {
  visible: boolean,
  onHide: () => void,
  onOk: (name: string) => void,
}

interface State {
  tagName: string,
}

class AddTagModal extends React.Component<Props, State> {
  public static propTypes = {
    visible: PropTypes.bool,
    onHide: PropTypes.func,
    onOk: PropTypes.func,
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      tagName: '',
    }
  }

  public handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tagName: e.target.value,
    })
  }

  public handleOk = () => {
    if (this.props.onOk) { this.props.onOk(this.state.tagName) }
  }

  public handleCancel = () => {
    if (this.props.onHide) { this.props.onHide() }
  }

  public render () {
    const { tagName } = this.state
    const { visible } = this.props
    return (
      <Modal visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Input value={tagName} onChange={this.handleTagNameChange}></Input>
      </Modal>
    )
  }
}

export default AddTagModal
