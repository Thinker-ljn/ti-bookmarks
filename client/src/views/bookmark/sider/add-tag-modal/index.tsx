import * as React from 'react'

import './index.scss'
import * as PropTypes from 'prop-types'

import { Input, Modal } from 'antd'

type Props = {
  visible: boolean,
  onHide: () => void,
  onOk: (name: string) => void
}

type State = {
  tagName: string
}

class AddTagModal extends React.Component<Props, State> {
  static propTypes = {
    visible: PropTypes.bool,
    onHide: PropTypes.func,
    onOk: PropTypes.func
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      tagName: ''
    }
  }

  handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tagName: e.target.value
    })
  }

  handleOk = () => {
    if (this.props.onOk) this.props.onOk(this.state.tagName)
  }

  handleCancel = () => {
    if (this.props.onHide) this.props.onHide()
  }

  render () {
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

