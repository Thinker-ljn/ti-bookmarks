interface TagData {
  name?: string
  parent_id?: number
}

export interface UpdateTag extends Partial<TagData> {
  id: number
}
export type CreateTag = Pick<TagData, ('name' | 'parent_id')>
