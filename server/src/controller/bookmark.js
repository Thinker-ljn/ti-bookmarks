const Bookmark = require('../model/bookmark.js')

const BookmarkController = {
  index: function () {
    return 'this is bookmark'
  },
  create: (formParams, urlParams) => {
    let bk = new Bookmark()
    bk.save({
      name: 'test' + Math.random(),
      url: 'test',
      tag: 1
    })
    return [formParams, urlParams]
  }
}

module.exports = BookmarkController
