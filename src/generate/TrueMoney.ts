import { encode, tag, withCrcTag } from '@/lib/tlv'

/**
 * Generate an `UCS-2`-like? Hex string for Tag 81
 *
 * This method is equivalent to:
 *
 * `Buffer.from(message, 'utf16le').swap16().toString('hex').toUpperCase()`
 *
 * @param message - Message
 * @returns Hex string of provided message
 */
function encodeTag81(message: string) {
  return message
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('')
    .toUpperCase()
}

interface Config {
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
export function truemoney({ mobileNo, amount, message }: Config) {
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
    payload.push(tag('54', amount.toFixed(2)))
  }

  if (message) {
    payload.push(tag('81', encodeTag81(message)))
  }

  return withCrcTag(encode(payload), '63')
}
