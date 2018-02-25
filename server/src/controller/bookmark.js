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
      name: $form.name,
      url: $form.url,
      tag: $form.tag_id
    })

    return bk
  }

  async delete (id) {
    let bk = await Bookmark.find(id)

    await bk.delete()
    return bk
  }
}

module.exports = BookmarkController
