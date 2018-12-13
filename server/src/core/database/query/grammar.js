const selectComponents = [
  'aggregate',
  'columns',
  'from',
  'joins',
  'wheres',
  'groups',
  'havings',
  'orders',
  'limit',
  'offset',
  'unions',
  'lock',
]

class Grammar {
  compileComponents (query) {
    let sql = {}
    for (let component of selectComponents) {
      let method = 'compile' + component.replace(/^\w/, component.slice(0, 1).toUpperCase())
      if (typeof this[method] === 'function') sql[component] = this[method](query, query[component])
    }

    return this.concatenate(sql)
  }

  concatenate (segments) {
    return Object.keys(segments).filter(key => {
      return segments[key]
    }).map(key => segments[key]).join(' ')
  }

  compileFrom (query, table) {
    return `from \`${table}\``
  }

  compileColumns (query, columns) {
    let select = query.distinct ? 'select distinct ' : 'select '
    if (!Array.isArray(columns) || columns.length === 0) {
      columns = '*'
    } else {
      columns = columns.map(column => `\`${column}\``).join(', ')
    }

    return select + columns
  }

  compileWheres (query, wheres) {
    let whereSql = ''
    for (let where of wheres) {
      whereSql += `${where.boolean} \`${where.column}\` ${where.operator} ? `
    }
    return whereSql.replace(/^(and|or)\s/, 'where ').replace(/\s$/, '')
  }

  compileInsert (query, data) {
    let table = query.from
    let keys = Object.keys(data[0])
    let columns = keys.map(k => `\`${k}\``).join(', ')
    let parameters = data.map(d => {
      return '(' + (new Array(keys.length)).fill('?').join(', ') + ')'
    }).join(', ')
    return `insert into \`${table}\` (${columns}) values ${parameters}`
  }

  getInsertBindings (query, data) {
    let keys = Object.keys(data[0])
    return data.reduce((bindings, d) => {
      return bindings.concat(keys.map(k => d[k]))
    }, [])
  }

  compileUpdate (query, data) {
    let table = query.from
    let columns = Object.keys(data).map(column => `\`${column}\` = ?`).join(', ')
    let wheres = this.compileWheres(query, query.wheres)
    return `update \`${table}\` set ${columns} ${wheres}`
  }

  getUpdateBindings (query, data) {
    // ['join', 'set', 'where', 'having', 'order', 'union']
    let updateBindings = Object.keys(data).map(key => data[key])
    let bindings = query.bindings
    return Object.keys(bindings)
    .filter(key => key !== 'select' || key !== 'join')
    .map(key => bindings[key])
    .reduce((prev, curr) => {
      return prev.concat(curr)
    }, bindings.join.concat(updateBindings))
  }

  compileDelete (query) {
    let table = query.from
    let wheres = this.compileWheres(query, query.wheres)
    return `delete from \`${table}\` ${wheres}`
  }

  compileTruncate (query) {
    let table = query.from
    return `truncate table \`${table}\``
  }
}

module.exports = Grammar
