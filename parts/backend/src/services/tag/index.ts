import Core from '@/core';
import Tag, { TagData } from './model';

interface UpdateParams extends Partial<TagData> {
  id: number
}

type CreateParams = Pick<TagData, ('name' | 'parent_id')>
interface GetParams {
  tree: 1 | 0
}
type TagTreeNode = TagData & {children: TagTreeNode[]}
type TagTree = TagTreeNode[]
interface MapTree {[key: string]: TagTreeNode[]}
export default class TagController extends Core.Controller {
  public async index ($get: GetParams) {
    const tags: TagData[] = await Tag.all()
    if (!$get.tree) { return tags }
    const result: TagTreeNode = {
      id: 0,
      parent_id: 0,
      name: '标签',
      children: [],
    }

    const map: MapTree = tags.reduce((prev: MapTree, curr: TagTreeNode) => {
      if (!prev[curr.parent_id]) { prev[curr.parent_id] = [] }
      prev[curr.parent_id].push(curr)
      return prev
    }, {})

    function getTagChildren (node: TagTreeNode) {
      const beforeChildren = map[node.id] ? map[node.id] : []
      const afterChildren: TagTree = []
      for (const child of beforeChildren) {
        child.children = getTagChildren(child)
        afterChildren.push(child)
      }
      return afterChildren
    }
    result.children = getTagChildren(result)

    return [result]
  }

  public async create ($form: CreateParams) {
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
    tag.name = $form.name
    tag.parent_id = $form.parent_id || 0
    await tag.save()
    return tag
  }

  public async update ($form: UpdateParams) {
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
    const tag = await Tag.find<Tag>($form.id)
    if ($form.name) { tag.name = $form.name }
    if ($form.parent_id) { tag.parent_id = $form.parent_id }

    await tag.save()

    return tag
  }

  public async delete (id: number) {
    const tag = await Tag.find(id)

    await tag.delete()
    return tag
  }

  public async bookmarks (id: number) {
    const tag = await Tag.find<Tag>(id)
    interface T { bookmark_id: number }
    const tagBkIds: T[] = await tag.bookmarks().getIds()
    return {[id]: tagBkIds.map(bk => bk.bookmark_id)}
  }
}
