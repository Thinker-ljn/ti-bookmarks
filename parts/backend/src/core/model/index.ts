import { PromiseConnection } from '../database/connection'
import Builder from '../database/query/builder'
import { Data } from '../database/query/grammar/components/where'
import BelongsToMany from './relations/belongs.to.many'

export interface IdData extends Data {
  id?: number
}

export interface ModelInstance {
  id?: number
}

export type ModelConstructor = new () => ModelInstance

export function defEnumerable (target: any, propertyKeys: string[]) {
  for (const propertyKey of propertyKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    descriptor.enumerable = false
    Object.defineProperty(target, propertyKey, descriptor)
  }
}

export default class Model<T extends IdData> implements ModelInstance {
  get id () {
    return this.properties.id
  }

  public static tableName: string
  public static connection: PromiseConnection

  public static setConnection (connection: PromiseConnection | (() => PromiseConnection)) {
    if (typeof connection === 'function') {
      this.connection = connection()
    } else {
      this.connection = connection
    }
  }

  public static newQuery <T extends IdData> () {
    if (!this.connection) { throw Error('Model Query Need A IdDatabase Connection!')}
    if (!this.tableName) { this.tableName = this.parseTableName() }
    return new Builder<T>(this.tableName, this.connection)
  }

  public static parseTableName () {
    return this.name.replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase().plural()
  }

  public static async all () {
    return await this.newQuery().all()
  }

  public static async find (id: number) {
    const result = await this.newQuery().find(id)
    if (!result.length) {
      throw new Error('Cannot find the model')
    }

    const model = new this()

    model.properties = result[0]
    return model
  }

  protected static: typeof Model = this.constructor as typeof Model
  public readonly tableName: string = this.static.parseTableName()
  public readonly modelName: string = this.static.name
  protected readonly primaryKey: string = 'id'
  protected properties: T
  constructor () {
    defEnumerable(this, ['modelName', 'tableName', 'primaryKey'])
  }

  public set (properties: T) {
    this.properties = properties
  }

  public get () {
    return this.properties
  }

  public async save (properties?: T) {
    if (properties) { this.properties = properties }
    const query = this.static.newQuery<T>()
    const result = await query.insert(this.properties)
    this.properties.id = result.insertId

    return result
  }

  public async update (properties?: T) {
    if (properties) { this.properties = properties }

    const query = this.static.newQuery()
    const pkValue = this.properties[this.primaryKey]
    const result = await query.where(this.primaryKey, pkValue).update(this.properties)

    return result
  }

  public async delete (properties?: T) {
    if (properties) { this.properties = properties }
    const pkValue = this.properties[this.primaryKey]
    const query = this.static.newQuery()
    const result = await query.where(this.primaryKey, pkValue).delete()

    return result
  }

  public belongsToMany (classB: ModelConstructor) {
    return new BelongsToMany<T>(this, classB, this.static.connection)
  }
}
