import Core from '@/core';
import { NonFunctionProperties } from '@/core/model';
import Bookmark from '../bookmark/model';

export default class Tag extends Core.Model {
  public id: number
  public name: string
  public parent_id: number
  public bookmarks () {
    return this.belongsToMany(Bookmark)
  }
}

export type TagData = NonFunctionProperties<Tag>
