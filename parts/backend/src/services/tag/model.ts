import Core from '@be/src/core';
import { NonFunctionProperties } from '@be/src/core/model';
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
