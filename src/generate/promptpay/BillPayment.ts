import { encode, tag, withCrcTag } from '@/lib/tlv'

interface Config {
  billerId: string
  amount?: number
  ref1: string
  ref2?: string
  ref3?: string
}

export function billPayment({ billerId, amount, ref1, ref2, ref3 }: Config) {
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
    payload.push(tag('54', amount.toFixed(2)))
  }

  if (ref3) {
    payload.push(tag('62', encode([tag('07', ref3)])))
  }

  return withCrcTag(encode(payload), '63')
}
