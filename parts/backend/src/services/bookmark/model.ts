import Core from '@be/src/core';
import { InstanceData, NonFunctionProperties } from '@be/src/core/model';
import Tag from '../tag/model';

export default class Bookmark extends Core.Model implements InstanceData {
  public name?: string = undefined
  public url?: string = undefined
  public tags () {
    return this.belongsToMany(Tag)
  }
}

export type OptionalBookmarkData = NonFunctionProperties<Bookmark>

export type BookmarkData = Required<OptionalBookmarkData>
