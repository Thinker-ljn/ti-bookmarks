import {mockHandler, MockAdapter, getStringify} from '../index'
import Axios from 'axios';
import * as assert from 'power-assert'
import TestData, { testDataExpects } from './test-data';

const bookmarks: any = [
  {id: 1, name: 'baidu', url: 'http://www.baidu.com', updated_at: null, created_at: null},
  {id: 2, name: 'zhihu', url: 'http://www.zhihu.com', updated_at: null, created_at: null},
]
const namespace = 'bookmarks'
mockHandler.register(namespace, bookmarks, ['url', 'name'])

Axios.defaults.adapter = MockAdapter

describe('test mock handler', () => {
  const st = getStringify(namespace)
  it ('get', (done) => {
    Axios.get(`${namespace}`).then((response) => {
      const [stExpect, stActual] = st(bookmarks, response.data)
      assert(stExpect === stActual)
      done()
    })
  })

  it ('post', (done) => {
    const postData = {name: 'postName', url: 'postUrl'}
    Axios.post(`${namespace}`, postData).then((response) => {
      const [stExpect, stActual] = st(postData, response.data)
      assert(stExpect === stActual)
      done()
    })
  })

  it ('patch', (done) => {
    const patchData = {id: 1, name: 'patchName'}
    const expect = {name: 'patchName', url: 'http://www.baidu.com'}
    Axios.patch(`${namespace}`, patchData).then((response) => {
      const [stExpect, stActual] = st(expect, response.data)
      assert(stExpect === stActual)
      done()
    })
  })

  it ('delete', (done) => {
    const expect = bookmarks[1]
    Axios.delete(`${namespace}/2`).then((response) => {
      const [stExpect, stActual] = st(expect, response.data)
      assert(stExpect === stActual)
      done()
    })
  })
})

describe('test data sequece', () => {
  const ttt = new TestData()
  const st = getStringify('test')
  it ('test stringify', () => {
    const a = [{name: 'afterPatchName', __status__: 'updating'}]
    const [sta] = st(a, a)
    assert(sta === '[{"name":"afterPatchName","__status__":"updating"}]')
  })
  it ('test equal', () => {
    const actualExpects = ttt.expects
    for (const k in testDataExpects) {
      const [stExpect, stActual] = st(testDataExpects[k], actualExpects[k])
      // console.info('=====================')
      // console.info(testDataExpects[k])
      // console.info('---------------------')
      // console.info(actualExpects[k])
      // console.info('=====================')
      assert(stExpect === stActual)
    }
  })
})
