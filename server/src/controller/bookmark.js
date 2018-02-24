const Bookmark = require('../model/bookmark.js')

const BookmarkController = {
  index: async function () {
    let result = await Bookmark.all()
    return result
  },
  create: async (formParams, urlParams) => {
    let bk = new Bookmark()
    let result = await bk.save({
      name: 'test' + Math.random(),
      url: 'test',
      tag: 2
    })

    return result
  }
}

module.exports = BookmarkController
