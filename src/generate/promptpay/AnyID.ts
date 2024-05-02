import { encode, tag, withCrcTag } from '@/lib/tlv'

export enum ProxyType {
  /** Mobile number */
  'MSISDN' = '01',

  /** National ID or Tax ID */
  'NATID' = '02',

  /** E-Wallet ID */
  'EWALLETID' = '03',

  /** Bank Account (Reserved) */
  'BANKACC' = '04',
}

export interface AnyIDConfig {
  /** Proxy type */
  type: keyof typeof ProxyType

  /** Recipient number */
  target: string

  /** Transaction amount */
  amount?: number
}

/**
 * Generate PromptPay AnyID (Tag 29) QR Code
 *
 * @returns QR Code Payload
 */
export function anyId({ type, target, amount }: AnyIDConfig) {
  if (type == 'MSISDN') {
    target = ('0000000000000' + target.replace(/^0/, '66')).slice(-13)
  }

  const tag29 = encode([
    tag('00', 'A000000677010111'),
    tag(ProxyType[type], target),
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

  return withCrcTag(encode(payload), '63')
}
