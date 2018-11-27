let fs = require('fs')
let path = require('path')

const make = function (type, name) {
  if (arguments.length > 2) {
    return console.error(`Too many arguments, expected arguments 'command', 'name'`)
  }

  if (!type) {
    return console.error(`Command 'make:${type}' is not defined`)
  }

  if (!name) {
    return console.error(`Command 'make:${type}' need argument 'name'`)
  }

  type = type.toLowerCase()
  let dir = path.resolve(process.cwd(), './src/services/' + name)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  let filename = type === 'controller' ? 'index' : name
  let filePath = dir + '/' + filename + '.js'
  if (fs.existsSync(filePath)) {
    return console.error(`'${type}' already exist!`)
  }

  let template = fs.readFileSync(path.resolve(__dirname, '../template/' + type + '.template'), 'utf8')
  template = template.replace(/\$\{name\}/g, name)

  fs.writeFileSync(filePath, template)

  console.info('create successful!')
}

module.exports = make
