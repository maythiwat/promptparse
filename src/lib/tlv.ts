import { crc16xmodem } from '@/utils/checksum'

export interface TLVTag {
  /** Tag ID */
  id: string

  /** Tag Value */
  value: string

  /** Sub Tags */
  subTags?: TLVTag[]

  /** Tag Length */
  length: number
}

/**
 * Decode TLV string into array of TLV Tags
 *
 * @param payload - TLV string
 * @returns Array of TLV Tags
 */
export function decode(payload: string) {
  const tags: TLVTag[] = []

  let idx = 0
  while (idx < payload.length) {
    const data = payload.substring(idx)

    const id = data.substring(0, 2)
    const length = parseInt(data.substring(2, 4))
    const value = data.substring(4, 4 + length)

    tags.push({ id, length, value })
    idx += length + 4
  }

  return tags
}

/**
 * Encode TLV Tags array into TLV string
 *
 * @param tags - Array of TLV Tags
 * @returns TLV string
 */
export function encode(tags: TLVTag[]) {
  let payload = ''

  for (const tag of tags) {
    payload += tag.id
    payload += ('00' + tag.length).slice(-2)

    if (tag.subTags) {
      payload += encode(tag.subTags)
      continue
    }

    payload += tag.value
  }

  return payload
}

/**
 * Generate CRC Checksum for provided string
 *
 * @param payload - Any string
 * @param upperCase - Return CRC Checksum as uppercase string
 * @returns CRC Checksum
 */
export function checksum(payload: string, upperCase = true) {
  let sum = crc16xmodem(payload, 0xffff).toString(16)
  sum = upperCase ? sum.toUpperCase() : sum.toLowerCase()
  sum = ('0000' + sum).slice(-4)
  return sum
}

/**
 * Get TLV string combined with CRC Tag
 *
 * @param payload - TLV string (without CRC Tag)
 * @param crcTagId - CRC Tag ID
 * @param upperCase - Return CRC Checksum as uppercase string
 * @returns TLV string + CRC Tag ID + CRC Length + CRC Checksum
 */
export function withCrcTag(
  payload: string,
  crcTagId: string,
  upperCase = true,
) {
  payload += ('00' + crcTagId).slice(-2)
  payload += '04'
  payload += checksum(payload, upperCase)
  return payload
}

/**
 * Get Tag or Sub-tag by Tag ID in array of TLV Tags
 *
 * @param tlvTags - Array of TLV Tags
 * @param tagId - Target Tag ID
 * @param subTagId - Target Sub-tag ID
 * @returns Instance of Target Tag/Sub-tag
 */
export function get(tlvTags: TLVTag[], tagId: string, subTagId?: string) {
  const tag = tlvTags.find((t) => t.id == tagId)

  if (subTagId) {
    return tag?.subTags?.find((s) => s.id == subTagId)
  }

  return tag
}

/**
 * Create new TLV Tag
 *
 * @param tagId - Tag ID
 * @param value - Tag Value
 * @returns TLV Tag
 */
export function tag(tagId: string, value: string): TLVTag {
  return {
    id: tagId,
    length: value.length,
    value,
  }
}
