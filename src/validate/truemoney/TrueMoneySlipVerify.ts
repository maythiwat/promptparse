import { parse } from '@/lib/parser'

/**
 * Validate & extract data from TrueMoney Slip Verify QR
 *
 * @param payload - QR Code Payload
 * @returns Type, Transaction ID and Date (DDMMYYYY) or null if payload invalid
 */
export function trueMoneySlipVerify(payload: string) {
  const ppqr = parse(payload, true)

  const eventType = ppqr?.getTagValue('00', '02')
  const transactionId = ppqr?.getTagValue('00', '03')
  const date = ppqr?.getTagValue('00', '04')

  if (
    ppqr?.getTagValue('00', '00') !== '01' &&
    ppqr?.getTagValue('00', '01') !== '01'
  ) {
    return null
  }

  return {
    eventType,
    transactionId,
    date,
  }
}
