import Base from './base'
import { tags$, tagsTree$, Tag } from '../branchs/tags'

class Tags extends Base<Tag[]> {
  constructor () {
    super({list: 1})
    this.source$ = tags$
    this.sources = {
      tree$: tagsTree$
    }
  }
}

export default Tags
