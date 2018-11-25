// make:model Tag -m
// make:controller Tag
require('module-alias/register')
const tool = require('./execution')

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

let commands = {
  make: ['model', 'controller', 'migration'],
  migrate: []
}

let match = command.name.match(/^([a-z]+)(?::([a-z]+))?$/)

if (match) {
  let [,namespace, type] = match

  if (!commands[namespace]) {
    return console.error(`Namespace '${namespace}' is not defined`)
  }

  let types = commands[namespace]
  if (types.length) {
    if (!type) {
      return console.error(`Command '${command.name}' need a type`)
    }
    if (!types.includes(type)) {
      return console.error(`Command '${command.name}' is not defined`)
    }
  }
  return tool[namespace].apply(null, [type].concat(command.params))
} else {
  return console.error(`Need exec command!`)
}
