import Core from '@/core';
import SpacedRepetition from '../spaced-repetition';
import Bookmark, { BookmarkData } from './model';

interface UpdateParams extends Partial<BookmarkData> {
  id: number
}

type CreateParams = Pick<BookmarkData, ('name' | 'url')> & {
  tag_id: string,
  repeat?: 1 | 0,
}

export default class BookmarkController extends Core.Controller {
  public async index () {
    return await Bookmark.all()
  }

  public async create ($form: CreateParams) {
    this.validate({
      name: 'string',
      url: 'url',
      tag_id: {
        required: false,
        type: 'string',
        format: /^((\d+,?)+)?(\d+)$/,
        convertType (v): string {
          return v + ''
        },
      },
      repeat: {
        required: false,
        type: 'int',
      },
    }, $form)

    const bk = new Bookmark()
    await bk.save({
      name: $form.name,
      url: $form.url,
    })

    let tagIds: number[] = []

    if ($form.tag_id) {
      tagIds = $form.tag_id.split(',').map(t => Number(t))
      await bk.tags().attach(tagIds)
    }

    if ($form.repeat) {
      await SpacedRepetition.add(bk)
    }
    // bk.set({tags: tagIds})
    return bk
  }

  public async update ($form: UpdateParams) {
    const bk = await Bookmark.find<Bookmark>($form.id)
    if ($form.name) { bk.name = $form.name }
    if ($form.url) { bk.url = $form.url }

    await bk.save()

    return bk
  }

  public async delete (id: number) {
    const bk = await Bookmark.find(id)

    await bk.delete()
    return bk
  }
}
