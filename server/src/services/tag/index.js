const Tag = require('./tag.js')
const Controller = require('@core/controller')

class TagController extends Controller {
  async index ($get) {
    let tags = await Tag.all()
    if (!$get.tree) return tags
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
    this.validate({
      name:{
        type: 'string',
        convertType: (v) => {
          return v + ''
        }
      },
      parent_id: {
        required: false,
        type: 'int'
      }
    }, $form)

    let tag = new Tag()
    await tag.save({
      name: $form.name,
      parent_id: $form.parent_id || 0
    })

    return tag
  }

  async update ($form) {
    this.validate({
      id: 'int',
      name: {
        required: false,
        type: 'string',
        convertType: (v) => {
          return v + ''
        }
      },
      parent_id: {
        required: false,
        type: 'int'
      }
    }, $form)
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

  async bookmarks (id) {
    let tag = await Tag.find(id)
    let tagBkIds = await tag.bookmarks().getIds()
    return {[id]: tagBkIds.map(bk => bk.bookmark_id)}
  }
}

module.exports = TagController
