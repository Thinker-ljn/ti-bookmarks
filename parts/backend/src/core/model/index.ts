import wordPlural from '@/core/plugins/plural';
import { PromiseConnection } from '../database/connection'
import Builder from '../database/query/builder'
import { Data } from '../database/query/grammar/components/where'
import BelongsToMany from './relations/belongs.to.many'

export type Property<T> = T | undefined
// tslint:disable-next-line: ban-types
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export type InstanceData = NonFunctionProperties<Model>
type PropertiesData = InstanceData & Data
export type ModelConstructor = new () => InstanceData

export function defEnumerable (target: any, propertyKeys: string[]) {
  for (const propertyKey of propertyKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    descriptor.enumerable = false
    Object.defineProperty(target, propertyKey, descriptor)
  }
}

export default class Model {
  public static tableName: string
  public static connection: PromiseConnection

  public static setConnection (connection: PromiseConnection | (() => PromiseConnection)) {
    if (typeof connection === 'function') {
      this.connection = connection()
    } else {
      this.connection = connection
    }
  }

  public static newQuery () {
    if (!this.connection) { throw Error('Model Query Need A IdDatabase Connection!')}
    return new Builder<PropertiesData>(this.parseTableName(), this.connection)
  }

  public static parseTableName (): string {
    return this.tableName ||
      (this.tableName = wordPlural.call(this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()))
  }

  public static async all () {
    return await this.newQuery().all()
  }

  public static async find <T extends Model>(id: number) {
    const result = await this.newQuery().find(id)
    if (!result.length) {
      throw new Error('Cannot find the model')
    }
    const model = (new this()) as T
    model.properties = result[0]
    return model
  }

  protected static: typeof Model = this.constructor as typeof Model
  protected readonly primaryKey: string = 'id'
  protected properties: PropertiesData = {}
  // ---- instance properties ----
  public id?: number = undefined
  constructor () {
    defEnumerable(this, ['primaryKey', 'properties', 'static'])
  }

  public sync (properties?: Partial<PropertiesData>) {
    // this.properties = Object.assign(this.properties, properties)
    if (properties) {
      for (const k in properties) {
        const descriptor = Reflect.getOwnPropertyDescriptor(this, k)
        if (descriptor && descriptor.enumerable) {
          Reflect.set(this, k, properties[k])
        }
      }
    }
    const keys = Reflect.ownKeys(this)
    for (const k of keys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(this, k)
      if (descriptor && descriptor.enumerable && descriptor.value !== undefined) {
        Reflect.set(this.properties, k, Reflect.get(this, k))
      }
    }
  }

  public get (properties?: Partial<PropertiesData>) {
    if (properties) {
      this.sync(properties)
    }
    const keys = Reflect.ownKeys(this)
    for (const k of keys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(this, k)
      if (descriptor && descriptor.enumerable) {
        Reflect.set(this.properties, k, Reflect.get(this, k))
      }
    }
    return this.properties
  }

  public async save (properties?: Partial<PropertiesData>) {
    this.sync(properties)
    const query = this.static.newQuery()
    const result = await query.insert(this.properties)
    this.sync({id: result.insertId})
    // this.properties.id = result.insertId
    // this.id = result.insertId
    return result
  }

  public async update (properties?: PropertiesData) {
    this.sync(properties)

    this.checkPrimaryKey()

    const query = this.static.newQuery()
    const pkValue = this.properties[this.primaryKey]
    const data = Object.keys(this.properties)
    .filter(k => k !== this.primaryKey)
    .reduce((prev: PropertiesData, k) => {
      prev[k] = this.properties[k]
      return prev
    }, {})
    const result = await query.where(this.primaryKey, pkValue).update(data)

    return result
  }

  public async delete (properties?: PropertiesData) {
    this.sync(properties)

    this.checkPrimaryKey()

    const pkValue = this.properties[this.primaryKey]
    const query = this.static.newQuery()
    const result = await query.where(this.primaryKey, pkValue).delete()

    return result
  }

  private checkPrimaryKey () {
    if (!this.properties[this.primaryKey]) {
      throw Error('Update Method Nedd A PrimaryKey')
    }
  }

  public belongsToMany (classB: ModelConstructor) {
    this.checkPrimaryKey()
    return new BelongsToMany(this, classB, this.static.connection)
  }

  public getModelName () {
    return this.static.name
  }

  public getTableName () {
    return this.static.parseTableName()
  }
}
