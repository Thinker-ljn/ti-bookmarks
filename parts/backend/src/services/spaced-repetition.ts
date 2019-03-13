import Core from '@/core';
import { Data } from '@/core/database/query/grammar/components/where';
import Cs133 from '@/core/plugins/Cs133';
import Bookmark from './bookmark/model';

export interface SpacedRepetitionData extends Data {
  name: string
}

const repetition = [2, 7, 14, 30, 90]
export default class SpacedRepetition extends Core.Model {
  public static async add (model: Bookmark) {
    const currTime = Cs133.formatted()
    for (const days of repetition) {
      const time = Cs133.dayOffset(days)
      const formatTime = time.formatted

      const sr = new this()
      sr.set({
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
