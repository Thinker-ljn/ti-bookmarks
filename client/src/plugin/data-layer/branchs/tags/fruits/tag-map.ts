import Fruit from "@/plugin/data-layer/core/fruit";
import { DLTag } from "@/plugin/data-layer";
import { Observable } from "rxjs";
import { keyBy } from 'lodash'
import { map } from "rxjs/operators";
import TagsBranch from "..";

type MapData = {[key: string]: DLTag}
export default class TagMapFruit extends Fruit<MapData, TagsBranch> {
  source_: Observable<MapData> = this.branch.default_.pipe(
    map((tags: DLTag[]) => keyBy(tags, '__key__'))
  )
}
