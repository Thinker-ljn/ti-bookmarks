const Tag = require('../model/Tag.js')
const Controller = require('./index')

class TagController extends Controller {
  async index () {
    let result = await Tag.all()
    return result
  }

  async create ($form) {
    let tag = new Tag()
    await tag.save({
      name: $form.name,
      parent_id: $form.parent_id
    })

    return tag
  }

  async delete (id) {
    let tag = await Tag.find(id)

    await tag.delete()
    return tag
  }
}

module.exports = TagController
