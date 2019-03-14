import Core from '@/core';
import { NonFunctionProperties } from '@/core/model';
import Bookmark from '../bookmark/model';

export default class Tag extends Core.Model {
  public name?: string = undefined
  public parent_id?: number = undefined
  public bookmarks () {
    return this.belongsToMany(Bookmark)
  }
}

export type OptionalTagData = NonFunctionProperties<Tag>

export type TagData = Required<OptionalTagData>
