import { encode, tag, withCrcTag } from '../lib/TagUtils'

/**
 * Generate Slip Verify QR Code
 * 
 * This also called "Mini-QR" that embedded in slip used for verify transactions
 *
 * @param sendingBankId - Bank Code
 * @param transactionRefId - Transaction Reference
 * @returns QR Instance with TLV Tags
 */
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
