export default interface TLVTag {
  id: string
  value: string
  subTags?: TLVTag[]
  length: number
}
