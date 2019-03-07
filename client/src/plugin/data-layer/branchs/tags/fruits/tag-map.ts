import Fruit from "@/plugin/data-layer/core/fruit";
import { DLTag } from "@/plugin/data-layer";
import { Observable } from "rxjs";
import { keyBy } from 'lodash'
import { map } from "rxjs/operators";

type MapData = {[key: string]: DLTag}
export default class TagMapFruit extends Fruit<DLTag, MapData> {
  source_: Observable<MapData> = this.branch.default_.pipe(
    map((tags: DLTag[]) => keyBy(tags, '__key__'))
  )
}
