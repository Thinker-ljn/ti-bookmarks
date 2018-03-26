let fs = require('fs')
let path = require('path')

module.exports = {
  make: function (type, name) {
    if (arguments.length > 2) {
      return console.error(`Too many arguments, expected arguments 'command', 'name'`)
    }

    if (!type) {
      return console.error(`Command 'make:${type}' is not defined`)
    }

    if (!name) {
      return console.error(`Command 'make:${type}' need argument 'name'`)
    }

    let dir = path.resolve(process.cwd(), './src/' + type)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    let filePath = dir + '/' + type + '.js'
    if (fs.existsSync(filePath)) {
      return console.error(`'${type}' already exist!`)
    }

    let template = fs.readFileSync(path.resolve(__dirname, './template/' + type + '.template'), 'utf8')
    template = template.replace(/\$\{name\}/g, name)

    fs.writeFileSync(filePath, template)

    console.info('create successful!')
  }
}
