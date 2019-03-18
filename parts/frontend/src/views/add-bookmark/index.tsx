import { Button, Layout } from 'antd'
import * as React from 'react'

import AddBookmark, { AddBookmarkRef } from '@/components/add-bookmark'
const { useRef } = React
export default function AddBookmarkView () {
  const submitAddBk = () => {
    if (!addBkRef.current) { return }
    addBkRef.current.handleSubmit()
  }
  const addBkRef: AddBookmarkRef = useRef(null)
  return <Layout>
    <AddBookmark ref={addBkRef}></AddBookmark>
    <Button onClick={submitAddBk}>提交</Button>
  </Layout>
}
