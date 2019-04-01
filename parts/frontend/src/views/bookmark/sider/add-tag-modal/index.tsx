import * as React from 'react'

import * as PropTypes from 'prop-types'
import './index.scss'

import { Input, Modal } from 'antd'

interface Props {
  text?: string
  visible: boolean,
  onHide: () => void,
  onOk?: (name: string) => void,
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
    if (this.props.onOk) { 
      this.resetInput()
      this.props.onOk(this.state.tagName) 
    }
  }

  public handleCancel = () => {
    if (this.props.onHide) {
      this.resetInput()
      this.props.onHide()
    }
  }

  public resetInput () {
    this.setState({
      tagName: '',
    })
  }

  public render () {
    const { tagName } = this.state
    const { visible, text } = this.props
    const title = text ? '编辑书签' : '添加子书签'

    const value = tagName || text
    return (
      <Modal visible={visible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Input value={value} onChange={this.handleTagNameChange}></Input>
      </Modal>
    )
  }
}

export default AddTagModal
