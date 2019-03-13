import Core from '@/core';
import { Data } from '@/core/database/query/grammar/components/where';
import Tag from '../tag/model';

export interface BookmarkData extends Data {
  id: number
  name: string
  url: string
}

export type BookmarkForm = Partial<BookmarkData>

export default class Bookmark extends Core.Model<BookmarkData> {
  public tags () {
    return this.belongsToMany(Tag)
  }
}
