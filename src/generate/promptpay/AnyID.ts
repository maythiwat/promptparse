import { encode, tag, withCrcTag } from '@/lib/tlv'

enum ProxyType {
  'MSISDN' = '01',
  'NATID' = '02',
  'EWALLETID' = '03',
  'BANKACC' = '04',
}

interface Config {
  type: keyof typeof ProxyType
  target: string
  amount?: number
}

export function anyId({ type, target, amount }: Config) {
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
    payload.push(tag('54', amount.toFixed(2)))
  }

  return withCrcTag(encode(payload), '63')
}
