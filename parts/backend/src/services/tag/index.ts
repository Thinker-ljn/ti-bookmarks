import Core from '@/core';
import Tag from './model';

export default class TagController extends Core.Controller {
  public async index ($get) {
    const tags = await Tag.all()
    if (!$get.tree) { return tags }
    const result = {
      id: 0,
      name: '标签',
      children: [],
    }

    const map = tags.reduce((prev, curr) => {
      if (!prev[curr.parent_id]) { prev[curr.parent_id] = [] }
      prev[curr.parent_id].push(curr)
      return prev
    }, {})

    function getTagChildren (node) {
      const children = map[node.id] ? map[node.id] : []
      let _children = []
      for (const child of children) {
        child.children = getTagChildren(child)
        _children.push(child)
      }
      return _children
    }
    result.children = getTagChildren(result)

    return [result]
  }

  public async create ($form) {
    this.validate({
      name: {
        type: 'string',
        convertType: (v) => {
          return v + ''
        },
      },
      parent_id: {
        required: false,
        type: 'int',
      },
    }, $form)

    const tag = new Tag()
    await tag.save({
      name: $form.name,
      parent_id: $form.parent_id || 0,
    })

    return tag
  }

  public async update ($form) {
    this.validate({
      id: 'int',
      name: {
        required: false,
        type: 'string',
        convertType: (v) => {
          return v + ''
        },
      },
      parent_id: {
        required: false,
        type: 'int',
      },
    }, $form)
    const tag = Tag.find($form.id)
    if ($form.name) { tag.name = $form.name }
    if ($form.parent_id) { tag.parent_id = $form.parent_id }

    await tag.save()

    return tag
  }

  public async delete (id) {
    const tag = await Tag.find(id)

    await tag.delete()
    return tag
  }

  public async bookmarks (id) {
    const tag = await Tag.find(id)
    const tagBkIds = await tag.bookmarks().getIds()
    return {[id]: tagBkIds.map(bk => bk.bookmark_id)}
  }
}
