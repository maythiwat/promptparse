import { encode, tag, withCrcTag } from '../lib/TagUtils'

export function generate(msisdn: string, amount?: number) {
  let payload = [
    tag('00', '01'), // (QR Version 1)
    tag('01', !amount ? '11' : '12'), // (11 multiple, 12 once)
    tag('29', encode([
      tag('00', 'A000000677010111'), // merchant presented qr
      tag('01', msisdn),   // (option A) msisdn
      // tag('02', '?'),  // (option B) nat id / tax id
      // tag('03', '?'),  // (option C) ewallet id (140 = TrueMoney Co., Ltd.)
    ])),
    tag('53', '764'), // iso currency code (764 = THB)
    tag('58', 'TH')   // country code (TH)
  ]

  if (amount) {
    payload.push(tag('54',  amount.toFixed(2))) // transaction amount (X.XX)
  }

  return withCrcTag(encode(payload), '63')
}
