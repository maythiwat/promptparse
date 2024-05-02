import { encode, tag, withCrcTag } from '@/lib/tlv'

export interface BillPaymentConfig {
  /** Biller ID (National ID or Tax ID + Suffix) */
  billerId: string

  /** Transaction amount */
  amount?: number

  /** Reference 1 */
  ref1: string

  /** Reference 2 */
  ref2?: string

  /** (Undocumented) Reference 3 */
  ref3?: string
}

/**
 * Generate PromptPay Bill Payment (Tag 30) QR Code
 *
 * @returns QR Code Payload
 */
export function billPayment({
  billerId,
  amount,
  ref1,
  ref2,
  ref3,
}: BillPaymentConfig) {
  const tag30 = [
    tag('00', 'A000000677010112'),
    tag('01', billerId),
    tag('02', ref1),
  ]

  if (ref2) {
    tag30.push(tag('03', ref2))
  }

  const payload = [
    tag('00', '01'),
    tag('01', !amount ? '11' : '12'),
    tag('30', encode(tag30)),
    tag('53', '764'),
    tag('58', 'TH'),
  ]

  if (amount) {
    payload.push(tag('54', Number(amount).toFixed(2)))
  }

  if (ref3) {
    payload.push(tag('62', encode([tag('07', ref3)])))
  }

  return withCrcTag(encode(payload), '63')
}
