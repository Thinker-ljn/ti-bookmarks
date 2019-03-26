import { PromiseConnection } from '@be/src/core/database/connection'
import Builder from '@be/src/core/database/query/builder'
import { Data } from '@be/src/core/database/query/grammar/components/where'
import { difference, intersection } from 'lodash';
import Model, { ModelConstructor } from '..'

export default class BelongsToMany {
  protected mA: Model
  protected kA: string
  protected kB: string
  protected tableName: string
  public connection: PromiseConnection
  protected properties: Data = {}

  constructor (mA: Model, clsB: ModelConstructor, connection: PromiseConnection) {
    this.mA = mA
    this.kA = this.formatKey(mA.constructor.name)
    this.kB = this.formatKey(clsB.name)
    this.tableName = this.parseTableName(mA, clsB)

    this.connection = connection
    this.properties[this.kA] = this.mA.id
  }

  public formatKey (key: string) {
    return (key + '_id').toLowerCase()
  }

  public parseTableName (mA: Model, cstcB: ModelConstructor) {
    return [mA.constructor.name, cstcB.name].sort().join('_').toLowerCase()
  }

  private newQuery () {
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

    const result = await this.newQuery().insert(datas)

    return result
  }

  public async detach (id: number | number[]) {
    const query = this.newQuery().where(this.kA, this.mA.id)
    const result = await query.whereIn(this.kB, id).delete()

    return result
  }

  public async update (updated: number | number[]) {
    return updated
  }

  public async sync (id: number | number[]) {
    const ids: number[] = Array.isArray(id) ? id : [id]
    const current = await this.getIds()
    const attach = difference(ids, current)
    const detach = difference(current, ids)
    const updated = intersection(ids, current)

    if (detach.length) {
      await this.detach(detach)
    }
    if (attach.length) {
      await this.attach(attach)
    }
    if (updated.length) {
      await this.update(updated)
    }

    return {
      attach,
      detach,
      updated,
    }
  }

  public async getIds () {
    const query = this.newQuery().where(this.kA, this.mA.id)
    return await query.select(this.kB)
  }

  public async get () {
    const query = this.newQuery().where(this.kA, this.mA.id)
    const result = await query.select()
    return result
  }
}
