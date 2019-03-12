import * as Koa from 'koa'
import DB from './database';
import Controller from './controller'
import Model from './model';

export default class Core extends Koa {
  DB = DB
  static Controller = Controller
  static Model = Model
  constructor () {
    super()

    Model.setConnection(DB.connection)
  }
}

