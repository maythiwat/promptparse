import EMVCoQR from './EMVCoQR'
import { decode, checksum } from './TagUtils'

export default class PromptParse {
  /**
   * Parse any EMVCo-compatible QR Code data string
   *
   * @param payload - QR Code data string from the scanner
   * @param strict - Validate CRC checksum before parsing the entire string
   * @param subTags - Parse TLV Sub-tags (If exists)
   * @returns QR Instance with TLV Tags
   */
  static parse(payload: string, strict = false, subTags = true) {
    if (!payload.match(/^\d{4}.+/)) return null // 0001A

    if (strict) {
      let expected = payload.slice(-4)
      let calculated = checksum(payload.slice(0, -4))
      if (expected != calculated) return null
    }

    let p = decode(payload)
    if (p.length == 0) return null

    if (subTags) {
      for (let i in p) {
        if (typeof p[i].value != 'string') continue // if it's already parsed
        if (!p[i].value.match(/^\d{4}.+/)) continue // 0001A

        let s = decode(p[i].value)
        let failed = 0
        for (let j in s) {
          if (s[j].length > 0 && s[j].length === s[j].value.length) continue
          failed++
        }

        if (!failed) p[i].subTags = s // passed!, add to object
      }
    }

    return new EMVCoQR(payload, p)
  }
}