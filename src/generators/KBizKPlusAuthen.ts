import { encode, tag, withCrcTag } from '../lib/TagUtils'

/**
 * Generate "Authen with K PLUS" QR Code for K BIZ (Kasikorn Bank)
 *
 * @param tokenId - Token ID parameter obtained from `generateKPlusAuthen.do`
 * @returns QR Instance with TLV Tags
 */
export function generate(tokenId: string) {
  const payload = [
    tag('00', '03'),
    tag('03', encode([
        tag('00', tokenId)
    ]))
  ]

  return withCrcTag(encode(payload), '99')
}
