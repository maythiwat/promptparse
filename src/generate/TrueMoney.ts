import { encode, tag, withCrcTag } from '@/lib/tlv'
import { encodeTag81 } from '@/utils/encoder'

export interface TrueMoneyConfig {
  /** Mobile number */
  mobileNo: string

  /** Transaction amount */
  amount?: number

  /** Personal message (Tag 81) */
  message?: string
}

/**
 * Generate QR Code for TrueMoney Wallet
 *
 * This QR Code can also be scanned with other apps,
 * just like a regular e-Wallet PromptPay QR
 * but `Personal Message (Tag 81)` will be ignored.
 *
 * @returns QR Code Payload
 */
export function trueMoney({ mobileNo, amount, message }: TrueMoneyConfig) {
  const tag29 = encode([
    tag('00', 'A000000677010111'),
    tag('03', `14000${mobileNo}`),
  ])

  const payload = [
    tag('00', '01'),
    tag('01', !amount ? '11' : '12'),
    tag('29', tag29),
    tag('53', '764'),
    tag('58', 'TH'),
  ]

  if (amount) {
    payload.push(tag('54', Number(amount).toFixed(2)))
  }

  if (message) {
    payload.push(tag('81', encodeTag81(message)))
  }

  return withCrcTag(encode(payload), '63')
}
