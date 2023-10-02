import { type TLVTag, encode, get, withCrcTag } from '@/lib/tlv'

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
    const tags = [...this.tags].filter((f) => f.id != crcTagId)
    const expected = withCrcTag(encode(tags), crcTagId)
    return this.payload === expected
  }
}
