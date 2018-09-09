const Bookmark = require('../model/Bookmark.js')
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
      url: $form.url
    })

    if ($form.tag_id) {
      await bk.tags().attach($form.tag_id)
    }

    return bk
  }

  async update ($form) {
    let bk = Bookmark.find($form.id)
    if ($form.name) bk.name = $form.name
    if ($form.url) bk.url = $form.url

    await bk.save()

    return bk
  }

  async delete (id) {
    let bk = await Bookmark.find(id)

    await bk.delete()
    return bk
  }
}

module.exports = BookmarkController
