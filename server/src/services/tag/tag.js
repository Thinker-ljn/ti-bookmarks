const Model = require('@core').Model
const Bookmark = require('../bookmark/bookmark.js')

class Tag extends Model {

  bookmarks () {
    return this.belongsToMany(Bookmark)
  }
}

module.exports = Tag
