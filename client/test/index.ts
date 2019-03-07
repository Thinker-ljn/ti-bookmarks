import Fruit from "@/plugin/data-layer/core/fruit";
import Branch from "@/plugin/data-layer/core/branch";
import { BranchData } from "@/plugin/data-layer/core/types";
import Tree from "@/plugin/data-layer/core/tree";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";
var assert = require('assert');
// import assert from 'assert'

interface Tag extends BranchData {
  name: string,
  children?: Tag[],
  parent_id?: number
}

interface Bookmark extends BranchData {
  name: string,
  url: string,
  tag?: number,
  tags?: number[]
}

class TagFruit extends Fruit<Tag> {
  source_: Observable<Tag[]>
  constructor (branch: TagBranch) {
    super(branch)
    this.source_ = this.branch.default_
  }
  test3 () {
    console.log(33333)
  }
}

// class BookmarkFruit extends Fruit {
//   test4 () {
//     console.log(44444)
//   }
// }

class TagBranch extends Branch<Tag> {
  readonly tag_: Observable<Tag[]> = this.registerFruit(TagFruit).source_

  test1 () {
    console.log(111)
  }
}

class BookmarkBranch extends Branch<Bookmark> {
  test2 () {
    console.log(2222)
  }
}

class DataLayer extends Tree {
  readonly tags: TagBranch = this.registerBranch(TagBranch)
  readonly boomarks: BookmarkBranch = this.registerBranch(BookmarkBranch)
}

let DL = new DataLayer


function geneGetResponse (data: Tag[]): AxiosResponse<any> {
  return {
    data: data,
    status: 200,
    statusText: '',
    headers: '',
    config: {
      url: 'tags',
      method: 'get',
      params: {}
    }
  }
}
function genePostResponse (data: Tag): AxiosResponse<any> {
  return {
    data: data,
    status: 200,
    statusText: '',
    headers: '',
    config: {
      url: 'tags',
      method: 'post',
      params: {}
    }
  }
}

describe('DL TEST', function () {
  it('Tag', function (done) {
    let next1: Tag[] = []
    let next2 = {id: 1, name: '234'}
    DL.root.source_.next(geneGetResponse(next1))
    DL.root.source_.next(genePostResponse(next2))
    DL.root.source_.complete()

    let tags = DL.tags.tag_
    let expects = [next1, [next2]]
    let i = 0
    tags.subscribe(v => {
      let expect = expects[i++]
      assert(expect.length === v.length)
      if (v.length) assert(expect[0] === v[0])
    }, () => {
      done(new Error('should not be called'))
    }, () => {
      done()
    })
})
})
