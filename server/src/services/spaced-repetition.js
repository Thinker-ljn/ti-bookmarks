const Model = require('@core').Model
const Cs133 = require('@core/lib/Cs133')

const repetition = [2, 7, 14, 30, 90]
class SpacedRepetition extends Model {
  static async add (model) {
    let currTime = Cs133.formatted()
    for (let days of repetition) {
      let time = Cs133.dayOffset(days)
      let formatTime = time.formatted

      let sr = new this
      sr.name = model.name || ''
      sr.model_type = model.$modelName
      sr.model_id = model.id
      sr.execute_time = formatTime
      sr.created_at = currTime
      await sr.save()
    }
  }
}

module.exports = SpacedRepetition
