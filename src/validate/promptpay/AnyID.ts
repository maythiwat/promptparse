import { ProxyType } from '@/generate/promptpay/AnyID'
import { parse } from '@/lib/parser'

/**
 * Validate & extract data from PromptPay AnyID (Tag 29) QR Code
 *
 * @param payload - QR Code Payload
 * @returns Proxy type, target identifier and optional amount or null if payload invalid
 */
export function anyId(payload: string) {
  const ppqr = parse(payload, true)

  const aidType = ppqr?.getTagValue('00')
  const tag29Aid = ppqr?.getTagValue('29', '00')

  if (aidType !== '01' || tag29Aid !== 'A000000677010111') {
    return null
  }

  // Resolve proxy type from sub-tag ID
  const proxyTypeEntry = (
    Object.entries(ProxyType) as [keyof typeof ProxyType, string][]
  ).find(([, id]) => ppqr?.getTagValue('29', id) !== undefined)

  if (!proxyTypeEntry) {
    return null
  }

  const [type, subTagId] = proxyTypeEntry
  let target = ppqr!.getTagValue('29', subTagId)!

  // Normalise MSISDN back to local format (0XXXXXXXXX)
  if (type === 'MSISDN' && target.length == 13 && target.startsWith('0066')) {
    target = '0' + target.slice(-9)
  }

  const amountStr = ppqr?.getTagValue('54')
  const amount = amountStr !== undefined ? parseFloat(amountStr) : undefined

  return {
    type,
    target,
    ...(amount !== undefined && { amount }),
  }
}
