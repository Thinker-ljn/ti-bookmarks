const Bookmark = require('../model/bookmark.js')
const Controller = require('./index')

class BookmarkController extends Controller {
  async index () {
    let result = await Bookmark.all()
    return result
  }

  async create ($form) {
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
