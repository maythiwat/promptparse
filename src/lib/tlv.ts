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
 * Lengths are counted in Unicode characters (code points), as defined in
 * EMVCo Merchant-Presented QR Specification v1.1, section 4.4.
 *
 * @param payload - TLV string
 * @returns Array of TLV Tags, or an empty array if the string is malformed
 */
export function decode(payload: string) {
  const chars = Array.from(payload)
  const tags: TLVTag[] = []

  let idx = 0
  while (idx < chars.length) {
    const id = chars.slice(idx, idx + 2).join('')
    const len = chars.slice(idx + 2, idx + 4).join('')
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(len)) {
      return []
    }

    const length = Number(len)
    if (length < 1 || idx + 4 + length > chars.length) {
      return []
    }

    const value = chars.slice(idx + 4, idx + 4 + length).join('')
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
    length: Array.from(value).length,
    value,
  }
}
