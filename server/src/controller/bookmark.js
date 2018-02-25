const Bookmark = require('../model/bookmark.js')

const BookmarkController = {
  index: async function () {
    let result = await Bookmark.all()
    return result
  },
  create: async ($form) => {
    let bk = new Bookmark()
    await bk.save({
      name: 'test' + Math.random(),
      url: 'test22',
      tag: 3
    })

    return bk
  }
}

module.exports = BookmarkController
