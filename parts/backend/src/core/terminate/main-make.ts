#! /usr/bin/env node
import * as program from 'commander'

program
    .option('-p, --path <path>', '模块模版路径').parse(process.argv)

const path = program.path
const action = program.args[0]

console.info('to do ..', path, action)