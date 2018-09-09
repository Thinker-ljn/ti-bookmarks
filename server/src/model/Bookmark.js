const Model = require('./index')
const Tag = require('./Tag')

class Bookmark extends Model {
  constructor () {
    super(...arguments)
  }

  tags () {
    return this.belongsToMany(Tag)
  }
}

module.exports = Bookmark