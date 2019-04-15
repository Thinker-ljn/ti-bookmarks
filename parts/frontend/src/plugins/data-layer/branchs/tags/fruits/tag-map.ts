import { DLTag } from '@fe/src/plugins/data-layer';
import Fruit from '@fe/src/plugins/data-layer/core/fruit';
import { keyBy } from 'lodash'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import TagsBranch from '..';

interface MapData {[key: string]: DLTag}
export default class TagMapFruit extends Fruit<MapData, TagsBranch> {
  public source_: Observable<MapData> = this.branch.default_.pipe(
    map((tags: DLTag[]) => keyBy(tags, '__key__')),
  )
}
