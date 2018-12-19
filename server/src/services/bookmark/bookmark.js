const Model = require('@core').Model
const Tag = require('../tag/tag.js')
class Bookmark extends Model {
  constructor () {
    super(...arguments)
  }

  tags () {
    return this.belongsToMany(Tag)
  }
}

module.exports = Bookmark
