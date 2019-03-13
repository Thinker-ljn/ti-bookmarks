import Core from '@/core';
import { Data } from '@/core/database/query/grammar/components/where';
import Bookmark from '../bookmark/model';

interface TagData extends Data {
  id: number
  name: string
  parent_id: number
}

export default class Tag extends Core.Model<TagData> {
  public bookmarks () {
    return this.belongsToMany(Bookmark)
  }
}
