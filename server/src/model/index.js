const db = require('../database')

class Model {
  constructor () {
    this.tableName = this.parseTableName()
  }

  save (data) {
    db.query('INSERT INTO ' + this.tableName + ' SET ?', data, function (err, result, fields) {
      if (err) throw err;
      console.log(result)
    })
  }

  parseTableName () {
    return this.constructor.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().plural()
  }
}

module.exports = Model
