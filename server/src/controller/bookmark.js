const Bookmark = require('../model/bookmark.js')

const BookmarkController = {
  index: function () {
    return 'this is bookmark'
  },
  create: async (formParams, urlParams) => {
    let bk = new Bookmark()
    let result = await bk.save({
      name: 'test' + Math.random(),
      url: 'test',
      tag: 2
    })
    console.log(result.rows)
    return result.rows.insertId
  }
}

module.exports = BookmarkController
