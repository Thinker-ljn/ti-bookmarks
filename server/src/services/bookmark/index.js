const Bookmark = require('./bookmark.js')
const SpacedRepetition = require('../spaced-repetition')
const Controller = require('@core/controller')

class BookmarkController extends Controller {
  async index () {
    let result = await Bookmark.all()
    return result
  }

  async create ($form) {
    this.validate({
      name: 'string',
      url: 'url',
      tag_id: {
        required: false,
        type: 'string',
        format: /^((\d+,?)+)?(\d+)$/,
        convertType: (v) => {
          return v + ''
        }
      },
      repeat: {
        required: false,
        type: 'int'
      }
    }, $form)

    let bk = new Bookmark()
    await bk.save({
      name: $form.name,
      url: $form.url
    })

    let tagIds = []

    if ($form.tag_id) {
      tagIds = $form.tag_id.split(',')
      await bk.tags().attach(tagIds)
    }

    if ($form.repeat) {
      await SpacedRepetition.add(bk)
    }
    bk.tags = tagIds
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
