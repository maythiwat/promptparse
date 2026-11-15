import { BOTBarcode } from '@/lib/BOTBarcode'
import { EMVCoQR } from '@/lib/EMVCoQR'
import { checksum, decode } from '@/lib/tlv'

/**
 * Parse any EMVCo-compatible QR Code data string
 *
 * @param payload - QR Code data string from the scanner
 * @param strict - Validate CRC checksum before parsing the entire string
 * @param subTags - Parse TLV Sub-tags (If exists)
 * @returns QR Instance with TLV Tags
 */
export function parse(payload: string, strict = false, subTags = true) {
  if (!payload.match(/^\d{4}.+/)) {
    return null
  }

  if (strict) {
    const expected = payload.slice(-4).toUpperCase()
    const calculated = checksum(payload.slice(0, -4))
    if (expected != calculated) return null
  }

  const tags = decode(payload)
  if (tags.length == 0) {
    return null
  }

  if (strict && tags[tags.length - 1].length != 4) {
    return null
  }

  if (subTags) {
    for (const tag of tags) {
      if (!tag.value.match(/^\d{4}.+/)) {
        continue
      }

      const sub = decode(tag.value)
      if (sub.length > 0) {
        tag.subTags = sub
      }
    }
  }

  return new EMVCoQR(payload, tags)
}

/**
 * Parse barcode data string (BOT Barcode Standard)
 *
 * @param payload - Barcode data string from the scanner
 * @returns BOT Barcode Instance
 */
export function parseBarcode(payload: string) {
  return BOTBarcode.fromString(payload)
}
