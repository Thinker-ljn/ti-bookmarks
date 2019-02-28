import { Tag } from './tags'
import { Bookmark } from './bookmarks'

export type PacketData = Tag | Tag[] | Bookmark | Bookmark[]

export {
  Tag,
  Bookmark
}
