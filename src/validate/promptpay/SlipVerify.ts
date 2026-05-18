import { parse } from '@/lib/parser'

/**
 * Validate & extract data from Slip Verify QR (for use with Bank Open API)
 *
 * @param payload - QR Code Payload
 * @param crcAutoFix - Attempt to fix bad checksum from bank app
 * @returns Bank code and Transaction reference or null if payload invalid
 */
export function slipVerify(payload: string, crcAutoFix = true) {
  if (crcAutoFix) {
    const idx = payload.lastIndexOf('9104')
    if (idx != -1) {
      const crc = payload.substring(idx + 4)
      if (crc.length > 0 && crc.length < 4) {
        payload = payload.substring(0, idx + 4) + crc.padStart(4, '0')
      }
    }
  }

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
