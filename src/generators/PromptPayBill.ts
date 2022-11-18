import { BillTransferId, BotTag, PayloadFormat, POIMethod, AID, CurrencyCode, CountryCode } from '../types';
import { encode, tag, withCrcTag } from '../lib/TagUtils'

export function generate(billerId: string, amount: number, ref1: string, ref2?: string) {

  const billPayload = [
    tag(BillTransferId.AID, AID.DOMESTIC),
    tag(BillTransferId.BILLER_ID, billerId),
    tag(BillTransferId.REF1, ref1),
  ]

  if (ref2) {
    billPayload.push(tag(BillTransferId.REF2, ref2))
  }

  const payload = [
    tag(BotTag.PAYLOAD_FORMAT, PayloadFormat.EMV_PRESENTED),
    tag(BotTag.POI_METHOD, !amount ? POIMethod.STATIC : POIMethod.DYNAMIC),
    tag(BotTag.BILL_PAYMENT, encode(billPayload)),
    tag(BotTag.COUNTRY_CODE, CountryCode.TH),
    tag(BotTag.TRANSACTION_CURRENCY, CurrencyCode.THB)
  ]

  if (amount) {
    payload.push(tag(BotTag.TRANSACTION_AMOUNT, amount.toFixed(2)))
  }

  return withCrcTag(encode(payload), BotTag.CRC)
}
