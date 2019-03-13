import * as Koa from 'koa'
import Controller from './controller'
import DB from './database';
import Model from './model';

export default class Core extends Koa {
  public static Controller = Controller
  public static Model = Model
  public DB = DB
  constructor () {
    super()

    Model.setConnection(DB.connection)
  }
}
