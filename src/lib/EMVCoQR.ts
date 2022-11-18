import TLVTag from './TLVTag'
import { get, encode, withCrcTag } from './TagUtils'

export default class EMVCoQR {
  private payload: string
  private tags: TLVTag[]

  constructor(payload: string, tags: TLVTag[]) {
    this.payload = payload
    this.tags = tags
  }

  public getTag(tagId: string, subTagId?: string) {
    return get(this.tags, tagId, subTagId)
  }

  public getTagValue(tagId: string, subTagId?: string) {
    return this.getTag(tagId, subTagId)?.value
  }

  public getTags() {
    return this.tags
  }

  public getPayload() {
    return this.payload
  }

  public validate(crcTagId: string) {
    let t = [...this.tags]
    t = t.filter(f => f.id != crcTagId)
    let p = encode(t)
    p = withCrcTag(p, crcTagId)
    return (this.payload == p)
  }
}
