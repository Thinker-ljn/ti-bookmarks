import { TestBaseData, mockHandler } from './mock';

export interface Bookmark {
  id: number
  name: string
  url: string
}

export default class BookmarkData extends TestBaseData<Bookmark> {
  public namespace = 'bookmarks'
  public compareKeys = ['name', 'url', '__status__']

  public get = [
    {id: 1, name: 'test1', url: 'http://test1.com'},
    {id: 2, name: 'test2', url: 'http://test2.com'},
  ]

  public post = {id: 3, name: 'postName', url: 'http://postName.com'}

  public patch = {id: 1, name: 'afterPatchName'}

  public delete = {id: 2}

  // public actions: Method[] = ['get', 'post']

  public expects: Bookmark[][]

  constructor () {
    super()
    mockHandler.register(this.namespace, this.get, this.compareKeys)
    this.expects = this.geneExpects()
  }
}
