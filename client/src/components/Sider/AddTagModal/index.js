import React, { Component } from 'react'

import './index.scss'
import PropTypes from 'prop-types'

import { Input, Modal } from 'antd'

class AddTagModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onHide: PropTypes.func,
    onOk: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      tagName: ''
    }
  }

  handleTagNameChange = (e) => {
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

