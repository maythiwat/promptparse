import { AID, BotTag, CountryCode, CreditTransferId, CurrencyCode, PayloadFormat, POIMethod } from '../types/Constants'
import { encode, tag, withCrcTag } from '../lib/TagUtils'

/**
 * Generate an `UCS-2`-like? Hex string for Tag 81
 * 
 * This method is equivalent to:
 * 
 * `Buffer.from(message, 'utf16le').swap16().toString('hex').toUpperCase()`
 *
 * @param message - Message
 * @returns Hex string of provided message
 */
export function encodeTag81(message: string) {
  return message.split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Generate QR Code for TrueMoney Wallet
 * 
 * This QR Code can also be scanned with other apps,
 * just like a regular e-Wallet PromptPay QR
 * but `Personal Message (Tag 81)` will be ignored.
 *
 * @param mobileNo - Mobile Number
 * @param amount - Transaction Amount
 * @param message - Personal Message (Tag 81)
 * @returns QR Instance with TLV Tags
 */
export function generate(mobileNo: string, amount?: number, message?: string) {
  const payload = [
    tag(BotTag.PAYLOAD_FORMAT, PayloadFormat.EMV_PRESENTED),
    tag(BotTag.POI_METHOD, !amount ? POIMethod.STATIC : POIMethod.DYNAMIC),
    tag(BotTag.CREDIT_TRANSFER, encode([
      tag(CreditTransferId.AID, AID.MERCHANT_PRESENTED),
      tag(CreditTransferId.E_WALLET_ID, `14000${mobileNo}`)
    ])),
    tag(BotTag.COUNTRY_CODE, CountryCode.TH),
    tag(BotTag.TRANSACTION_CURRENCY, CurrencyCode.THB)
  ]

  if (amount) {
    payload.push(tag(BotTag.TRANSACTION_AMOUNT, amount.toFixed(2)))
  }

  if (message) {
    payload.push(tag('81', encodeTag81(message)))
  }

  return withCrcTag(encode(payload), BotTag.CRC)
}
