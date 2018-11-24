const Tag = require('../model/Tag.js')
const Controller = require('./index')

class TagController extends Controller {
  async index () {
    let tags = await Tag.all()
    let result = {
      id: 0,
      name: '标签',
      children: []
    }

    let map = tags.reduce((prev, curr) => {
      if (!prev[curr.parent_id]) prev[curr.parent_id] = []
      prev[curr.parent_id].push(curr)
      return prev
    }, {})

    function getTagChildren (node) {
      const children = map[node.id] ? map[node.id] : []
      let _children = []
      for (let child of children) {
        child.children = getTagChildren(child)
        _children.push(child)
      }
      return _children
    }
    result.children = getTagChildren(result)

    return [result]
  }

  async create ($form) {
    let tag = new Tag()
    await tag.save({
      name: $form.name,
      parent_id: $form.parent_id || 0
    })

    return tag
  }

  async update ($form) {
    let tag = Tag.find($form.id)
    if ($form.name) tag.name = $form.name
    if ($form.parent_id) tag.parent_id = $form.parent_id

    await tag.save()

    return tag
  }

  async delete (id) {
    let tag = await Tag.find(id)

    await tag.delete()
    return tag
  }
}

module.exports = TagController
