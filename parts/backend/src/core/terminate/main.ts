#! /usr/bin/env node
import * as program from 'commander'

program
    .version('0.0.1')
    .command('migrate [action]', '迁移数据库')
    .command('make [module]', '创新模块')
    .parse(process.argv)
