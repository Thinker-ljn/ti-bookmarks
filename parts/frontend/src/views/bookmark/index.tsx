import { Layout } from 'antd'
import * as React from 'react'
import AppContent from './content'
import AppSider from './sider/index'

export default class Bookmark extends React.Component<null, null> {
  constructor (props: null) {
    super(props)
  }

  public render () {
    return (
        <Layout>
          <AppSider></AppSider>
          <AppContent></AppContent>
        </Layout>
    )
  }
}
