import Base from './base'
import { tags$, tagsTree$, tagsRelation$, Tag } from '../branchs/tags'

class Tags extends Base<Tag[]> {
  constructor () {
    super({list: 1})
    this.source$ = tags$
    this.sources = {
      tree$: tagsTree$,
      relation$: tagsRelation$
    }
  }
}

export default Tags
