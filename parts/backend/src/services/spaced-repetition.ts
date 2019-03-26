import Core from '@be/src/core';
import { NonFunctionProperties } from '@be/src/core/model';
import Cs133 from '@be/src/core/plugins/Cs133';
import Bookmark from './bookmark/model';

const repetition = [2, 7, 14, 30, 90]
export default class SpacedRepetition extends Core.Model {
  public name?: string = undefined
  public model_type?: string = undefined
  public model_id?: number = undefined
  public reviewed?: 1 | 0 = undefined
  public execute_time?: string = undefined
  public static async add (model: Bookmark) {
    const currTime = Cs133.formatted()
    for (const days of repetition) {
      const time = Cs133.dayOffset(days)
      const formatTime = time.formatted

      const sr = new this()
      sr.sync({
        name: model.name || '',
        model_type: model.getModelName(),
        model_id: model.id,
        execute_time: formatTime,
        created_at: currTime,
      })
      await sr.save()
    }
  }
}

export type OptionalSpacedRepetitionData = NonFunctionProperties<SpacedRepetition>

export type SpacedRepetitionData = Required<OptionalSpacedRepetitionData>
