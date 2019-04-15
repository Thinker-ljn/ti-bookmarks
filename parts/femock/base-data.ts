import { Method, mockHandler } from '.';

type HFn<T> = (prev: T[], pendding: T, after: T, remove?: boolean) => T[][]
type HData<T> = {
  [key in Exclude<Method, 'get'>]: HFn<T>
}
type Patch<T> = Partial<T> & {id: number}
const actionStatus = {post: 'creating', patch: 'updating', delete: 'deleting'}
export default abstract class TestBaseData<T> {
  public abstract namespace: string
  public abstract compareKeys: string[]
  public abstract get: T[]

  public abstract post: T

  public abstract patch: Patch<T>

  public abstract delete: {id: number}

  public abstract expects: T[][]

  public expectSingle: {[key in Exclude<Method, 'get'>]: T[][]} | {[key: string]: T[][]} = {}
  public actions: Method[] = ['get', 'post', 'patch', 'delete']

  protected geneExpects (): T[][] {
    let expects: T[][] = []
    let prev: T[] = []
    const handlerFn = geneHandler<T>()
    for (const m of this.actions) {
      if (m === 'get') {
        expects.push(this.get)
        prev = clone(this.get)
      } else {
        const [param, pendding, after] = this.geneData(m)
        this.expectSingle[m] = [[pendding], [after]]
        this[m] = param

        const [_pendding, _after] = handlerFn[m](prev, pendding, after)
        expects = expects.concat(
          [_pendding, _after]
        )
        prev = clone(_after)
      }
    }
    return expects
  }

  protected geneData (method: Exclude<Method, 'get'>) {
    const param = clone(this[method])
    const after = mockHandler.preprocess(this.namespace, method, param)
    const status = actionStatus[method]
    const pendding = Object.assign({}, after, {__status__: status})
    return [param, pendding, after]
  }
}


function clone (data: any) {
  return JSON.parse(JSON.stringify(data))
}
function geneHandler <T>() {
  const handler: HData<T> = {
    post (prev, pendding, after) {
      return [
        prev.concat(pendding),
        prev.concat(after),
      ]
    },
    patch (prev, pendding, after, remove = false) {
      let copy = clone(prev)
      copy = mockHandler.update(copy, pendding, false)
      let copy2 = clone(prev)
      copy2 = mockHandler.update(copy2, after, remove)
      return [
        copy,
        copy2,
      ]
    },
    delete (prev, pendding, after) {
      return handler.patch(prev, pendding, after, true)
    },
  }
  return handler
}
