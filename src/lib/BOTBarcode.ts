import { billPayment } from '@/generate/promptpay/BillPayment'

export class BOTBarcode {
  public billerId: string
  public ref1: string
  public ref2: string | null
  public amount: number | null

  constructor(
    billerId: string,
    ref1: string,
    ref2: string | null = null,
    amount: number | null = null,
  ) {
    this.billerId = billerId
    this.ref1 = ref1
    this.ref2 = ref2
    this.amount = amount
  }

  static fromString(payload: string) {
    if (!payload.startsWith('|')) {
      return null
    }

    const data = payload.slice(1).split('\r', 4)
    if (data.length != 4) {
      return null
    }

    const [billerId, ref1, ref2, amount] = data

    return new BOTBarcode(
      billerId,
      ref1,
      ref2.length > 0 ? ref2 : null,
      amount != '0' ? Number((parseInt(amount) / 100).toFixed(2)) : null,
    )
  }

  toString() {
    const { billerId, ref1, ref2, amount } = this
    const amountStr = amount ? String(Number(amount.toFixed(2)) * 100) : '0'
    return `|${billerId}\r${ref1}\r${ref2 ?? ''}\r${amountStr}`
  }

  /**
   * Converts BOT Barcode to PromptPay QR Tag 30 (Bill Payment)
   *
   * This method works for some biller, depends on destination bank
   *
   * @returns QR Code payload
   */
  toQrTag30() {
    const { billerId, ref1, ref2, amount } = this
    return billPayment({
      billerId,
      ref1,
      ref2: ref2 ?? undefined,
      amount: amount ?? undefined,
    })
  }
}
