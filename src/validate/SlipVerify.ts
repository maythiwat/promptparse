import { parse } from '@/lib/parser'

/**
 * Validate & extract data from Slip Verify QR (for use with Bank Open API)
 *
 * @param payload - QR Code Payload
 * @returns Bank code and Transaction reference or null if payload invalid
 */
export function slipVerify(payload: string) {
  const ppqr = parse(payload, true)

  const apiType = ppqr?.getTagValue('00', '00')
  const sendingBank = ppqr?.getTagValue('00', '01')
  const transRef = ppqr?.getTagValue('00', '02')

  if (apiType !== '000001' || !sendingBank || !transRef) {
    return null
  }

  return {
    sendingBank,
    transRef,
  }
}
