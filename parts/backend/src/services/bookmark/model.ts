import Core from '@/core';
import { InstanceData, NonFunctionProperties } from '@/core/model';
import Tag from '../tag/model';

export default class Bookmark extends Core.Model implements InstanceData {
  public id: number
  public name: string
  public url: string
  public tags () {
    return this.belongsToMany(Tag)
  }
}

export type BookmarkData = NonFunctionProperties<Bookmark>
