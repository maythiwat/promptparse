import { parse } from '@/lib/parser'

/**
 * Validate & extract data from PromptPay Bill Payment (Tag 30) QR Code
 *
 * @param payload - QR Code Payload
 * @returns Biller ID, references and optional amount or null if payload invalid
 */
export function billPayment(payload: string) {
  const ppqr = parse(payload, true)

  const aidType = ppqr?.getTagValue('00')
  const tag30Aid = ppqr?.getTagValue('30', '00')
  const billerId = ppqr?.getTagValue('30', '01')
  const ref1 = ppqr?.getTagValue('30', '02')

  if (aidType !== '01' || tag30Aid !== 'A000000677010112' || !billerId || !ref1) {
    return null
  }

  const ref2 = ppqr?.getTagValue('30', '03')
  const ref3 = ppqr?.getTagValue('62', '07')

  const amountStr = ppqr?.getTagValue('54')
  const amount = amountStr !== undefined ? parseFloat(amountStr) : undefined

  return {
    billerId,
    ref1,
    ...(ref2 !== undefined && { ref2 }),
    ...(ref3 !== undefined && { ref3 }),
    ...(amount !== undefined && { amount }),
  }
}
