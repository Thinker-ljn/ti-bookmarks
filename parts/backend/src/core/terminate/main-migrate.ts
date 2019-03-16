#! /usr/bin/env node
import * as program from 'commander'
import { PromiseConnection } from '../database/connection';
import Migration, { Options } from '../database/migration';

program
    .option('-p, --path <path>', '迁移文件路径').parse(process.argv)

const path = program.path
const action = program.args[0] as Options['action']

PromiseConnection.Instance.connect().then((connect) => {
  const migration = new Migration(connect)
  try {
    migration.exec({
      path,
      action,
    }).then(() => {
      process.exit()
    })
  } catch (e) {
    throw e
  }
}, (err) => {
  throw err
})
