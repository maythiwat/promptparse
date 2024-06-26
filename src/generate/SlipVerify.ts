import { encode, tag, withCrcTag } from '@/lib/tlv'

export interface SlipVerifyConfig {
  /** Bank code */
  sendingBank: string

  /** Transaction reference */
  transRef: string
}

/**
 * Generate Slip Verify QR Code
 *
 * This also called "Mini-QR" that embedded in slip used for verify transactions
 *
 * @returns QR Code Payload
 */
export function slipVerify({ sendingBank, transRef }: SlipVerifyConfig) {
  const payload = [
    tag(
      '00',
      encode([
        tag('00', '000001'),
        tag('01', sendingBank),
        tag('02', transRef),
      ]),
    ),
    tag('51', 'TH'),
  ]

  return withCrcTag(encode(payload), '91')
}
