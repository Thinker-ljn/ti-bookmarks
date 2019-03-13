import { PromiseConnection } from '@/core/database/connection'
import Builder from '@/core/database/query/builder'
import { Data } from '@/core/database/query/grammar/components/where'
import Model, { IdData, ModelConstructor } from '..'

export default class BelongsToMany<A extends IdData> {
  protected mA: Model<A>
  protected kA: string
  protected kB: string
  protected tableName: string
  public connection: PromiseConnection
  protected properties: Data

  constructor (mA: Model<A>, clsB: ModelConstructor, connection: PromiseConnection) {
    this.mA = mA
    this.kA = this.formatKey(mA.constructor.name)
    this.kB = this.formatKey(clsB.name)
    this.tableName = this.parseTableName(mA, clsB)

    this.connection = connection
    this. properties[this.kA] = this.mA.id
  }

  public formatKey (key: string) {
    return (key + 'id').toLowerCase()
  }

  public parseTableName (mA: Model<A>, cstcB: ModelConstructor) {
    return [mA.constructor.name, cstcB.name].sort().join('').toLowerCase()
  }

  get builder () {
    return new Builder(this.tableName, this.connection)
  }

  public async attach (ids: number | number[]) {
    const datas: Data[] = []
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    ids.forEach((id) => {
      const data: Data = {}
      data[this.kA] = this.mA.id
      data[this.kB] = id
      datas.push(data)
    })

    const result = await this.builder.insert(datas)

    return result
  }

  public async detach (id: number) {
    const query = this.builder.where(this.kA, this.mA.id)
    const result = await query.where(this.kB, id).delete()

    return result
  }

  public async sync () {

  }

  public async getIds () {
    const query = this.builder.where(this.kA, this.mA.id)
    return await query.select(this.kB)
  }

  public async get () {
    const query = this.builder.where(this.kA, this.mA.id)
    const result = await query.select()
    return result
  }
}
