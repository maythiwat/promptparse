import { CreditTransferId, PayloadFormat, POIMethod, AID, CountryCode, CurrencyCode, BotTag } from '../types';
import { encode, tag, withCrcTag } from '../lib/TagUtils'
import { formatTarget } from '../utils/Formatter'

export function generate(targetId: string, amount?: number) {
  const receiverType = (
    targetId.length >= 15 ? (
      CreditTransferId.E_WALLET_ID
    ) : targetId.length >= 13 ? (
      CreditTransferId.TAX_ID
    ) : (
      CreditTransferId.PHONE_NUMBER
    )
  )

  const payload = [
    tag(BotTag.PAYLOAD_FORMAT, PayloadFormat.EMV_PRESENTED),
    tag(BotTag.POI_METHOD, !amount ? POIMethod.STATIC : POIMethod.DYNAMIC),
    tag(BotTag.CREDIT_TRANSFER, encode([
      tag(CreditTransferId.AID, AID.MERCHANT_PRESENTED),
      tag(receiverType, formatTarget(targetId)),
    ])),
    tag(BotTag.COUNTRY_CODE, CountryCode.TH),
    tag(BotTag.TRANSACTION_CURRENCY, CurrencyCode.THB)
  ]

  if (amount) {
    payload.push(tag(BotTag.TRANSACTION_AMOUNT, amount.toFixed(2))) // transaction amount (X.XX)
  }

  return withCrcTag(encode(payload), BotTag.CRC)
}
