import * as React from 'react'
import AppSider from './sider/index'
import AppContent from './content'
import { Layout } from 'antd'

export default class Bookmark extends React.Component<null, null> {
  constructor(props: null) {
    super(props)
  }

  render() {
    return (
        <Layout>
          <AppSider></AppSider>
          <AppContent></AppContent>
        </Layout>
    )
  }
}
