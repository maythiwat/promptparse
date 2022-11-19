import { encode, tag, withCrcTag } from '../lib/TagUtils'

export function generate(sendingBankId: string, transactionRefId: string) {
  const payload = [
    tag('00', encode([
      tag('00', '000001'), // Verify Pay Slip API
      tag('01', sendingBankId),
      tag('02', transactionRefId)
    ])),
    tag('51', 'TH')
  ]

  return withCrcTag(encode(payload), '91')
}
