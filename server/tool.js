// make:model Tag -m
// make:controller Tag
const tool = require('./plugin/tool')

let argv = process.argv.slice(2)

let command = {
  name: '',
  params: [],
  options: []
}

while (argv.length) {
  arg = argv.shift()

  if (isOption(arg)) {
    command.options.push(arg)
    continue
  }

  if (!command.name) {
    command.name = arg
  } else {
    command.params.push(arg)
  }
}
console.log(command)

function isOption (arg) {
  let match = /^-[^\s]*$/
  return match.test(arg)
}

function make (type, name) {
  if (arguments.length > 2) {
    return console.error(`Too many arguments, expected arguments 'command', 'name'`)
  }

  if (!type) {
    return console.error(`Command 'make:${type}' is not defined`)
  }

  if (!name) {
    return console.error(`Command 'make:${type}' need argument 'name'`)
  }

  console.log(type, name)
}

let commands = {
  make: ['model', 'controller', 'migration']
}

let match = command.name.match(/^([a-z]+)(?::([a-z]+))?$/)

if (match) {
  let [,namespace, type] = match

  if (type) {
    if (!commands[namespace]) {
      return console.error(`Namespace '${namespace}' is not defined`)
    }

    if (!commands[namespace].includes(type)) {
      return console.error(`Command '${command.name}' is not defined`)
    }

    return tool[namespace].apply(null, [type].concat(command.params))
  }

  return console.error(`Command '${command.name}' need a type`)

} else {
  return console.error(`Need exec command!`)
}
