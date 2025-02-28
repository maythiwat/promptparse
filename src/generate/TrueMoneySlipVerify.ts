import { encode, tag, withCrcTag } from '@/lib/tlv'

export interface TrueMoneySlipVerifyConfig {
  /** Event Type (Example: P2P) */
  eventType: string

  /** Transaction ID */
  transactionId: string

  /** Date (DDMMYYYY) */
  date: string
}

/**
 * Generate TrueMoney Slip Verify QR Code
 *
 * Same as a regular Slip Verify QR but with some differences
 * - Tag 00 and 01 are set to '01'
 * - Tag 51 does not exist
 * - Additional tags that are TrueMoney-specific
 * - CRC checksum are case-sensitive
 *
 * @returns QR Code Payload
 */
export function trueMoneySlipVerify({
  eventType,
  transactionId,
  date,
}: TrueMoneySlipVerifyConfig) {
  const payload = [
    tag(
      '00',
      encode([
        tag('00', '01'),
        tag('01', '01'),
        tag('02', eventType),
        tag('03', transactionId),
        tag('04', date),
      ]),
    ),
  ]

  return withCrcTag(encode(payload), '91', false)
}
