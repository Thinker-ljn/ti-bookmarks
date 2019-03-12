import { PromiseConnection } from "@/core/database/connection";
import Model, { ModelConstructor, IdData } from "..";
import { Data } from "@/core/database/query/types";
import Builder from "@/core/database/query/builder";

export default class BelongsToMany<A extends IdData> {
  protected _mA: Model<A>
  protected _kA: string
  protected _kB: string
  protected _tableName: string
  connection: PromiseConnection
  protected _properties: Data

  constructor (mA: Model<A>, clsB: ModelConstructor, connection: PromiseConnection) {
    this._mA = mA
    this._kA = this.formatKey(mA.constructor.name)
    this._kB = this.formatKey(clsB.name)
    this._tableName = this.parseTableName(mA, clsB)

    this.connection = connection
    this. _properties[this._kA] = this._mA.id
  }

  formatKey (key: string) {
    return (key + '_id').toLowerCase()
  }

  parseTableName (mA: Model<A>, cstcB: ModelConstructor) {
    return [mA.constructor.name, cstcB.name].sort().join('_').toLowerCase()
  }

  get builder () {
    return new Builder(this._tableName, this.connection)
  }

  async attach (ids: number | number[]) {
    let datas: Data[] = []
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    ids.forEach(id => {
      let data: Data = {}
      data[this._kA] = this._mA.id
      data[this._kB] = id
      datas.push(data)
    })

    let result = await this.builder.insert(datas)

    return result
  }

  async detach (id: number) {
    let query = this.builder.where(this._kA, this._mA.id)
    let result = await query.where(this._kB, id).delete()

    return result
  }
  
  async sync () {

  }

  async getIds () {
    let query = this.builder.where(this._kA, this._mA.id)
    return await query.select(this._kB)
  }

  async get () {
    let query = this.builder.where(this._kA, this._mA.id)
    let result = await query.select()
    return result
  }
}