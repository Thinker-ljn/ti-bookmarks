import * as assert from 'power-assert'
import 'es6-shim'
import DataLayerTree, { getStringify } from './mock/test-data-layer';
import BookmarkData from './mock/bookmarks';

const st = getStringify('bookmarks')

describe('tree', () => {
  const bookmark = new BookmarkData()
  const DL = new DataLayerTree()
  setTimeout(() => {
    DL.bookmarks.post(bookmark.post)
  }, 200);
  setTimeout(() => {
    DL.bookmarks.patch(bookmark.patch)
  }, 300);
  setTimeout(() => {
    DL.bookmarks.delete(bookmark.delete)
  }, 400);
  
  it ('tree bookmarks', (done) => {
    const expects = bookmark.expects
    let i = 0
    if (DL.bookmarks.from === 'axios') {
      expects.unshift([])
    }

    DL.bookmarks.default_.subscribe(actual => {
      const expect = expects[i++]
      // console.info('=====================')
      // console.info(expect)
      // console.info('---------------------')
      // console.info(actual)
      // console.info('=====================')
      assert(expect.length === actual.length)
      const [stExpect, stActual] = st(expect, actual)
      assert(stExpect === stActual)
      if (expects.length === i) {
        done()
      }
    }, (e) => {
      console.info('----error-----')
      assert(e instanceof Error === false)
      done()
    }, () => {
      done()
    })
  })
  // it ('tree bookmarks', (done) => {
  //   const bookmark = new BookmarkData()
  //   const DL = new DataLayerTree()
  //   DL.bookmarks.post(bookmark.post)
  //   const expects = bookmark.expectSingle.post
  //   expects.unshift([])
  //   let i = 0

  //   DL.bookmarks.create_.subscribe(actual => {
  //     const expect = expects[i++]
  //     console.info('=====================')
  //     console.info(expect)
  //     console.info('---------------------')
  //     console.info(actual)
  //     console.info('=====================')
  //     const [stExpect, stActual] = st(expect, actual)
  //     assert(stExpect === stActual)
  //     // done()
  //   }, (e) => {
  //     console.info('----error-----')
  //     assert(e instanceof Error === false)
  //     done()
  //   }, () => {
  //     done()
  //   })
  // })
})
