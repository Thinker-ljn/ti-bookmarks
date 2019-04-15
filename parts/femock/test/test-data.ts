import TestBaseData from '../base-data';
import { mockHandler } from '..';
interface Test {
  id: number
  name: string
}

export default class TestData extends TestBaseData<Test> {
  public namespace = 'test'
  public compareKeys = ['name', '__status__']

  public get = [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
  ]

  public post = {id: 3, name: 'postName'}

  public patch = {id: 1, name: 'afterPatchName'}

  public delete = {id: 2}

  public expects: Test[][]
  
  constructor () {
    super()
    mockHandler.register(this.namespace, this.get, this.compareKeys)
    this.expects = this.geneExpects()
  }
}

export const testDataExpects = [
  // get
  [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
  ],
  // creating
  [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'postName', __status__: 'creating'},
  ],
  // created
  [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'postName'},
  ],
  // updating
  [
    // {id: 1, name: 'test1'},
    {id: 1, name: 'afterPatchName', __status__: 'updating'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'postName'},
  ],
  // updated
  [
    {id: 1, name: 'afterPatchName'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'postName'},
  ],
  // deleting
  [
    {id: 1, name: 'afterPatchName'},
    // {id: 2, name: 'test2'},
    {id: 2, name: 'test2', __status__: 'deleting'},
    {id: 3, name: 'postName'},
  ],
  // deleted
  [
    {id: 1, name: 'afterPatchName'},
    {id: 3, name: 'postName'},
  ]
]