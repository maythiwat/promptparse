import { BOTBarcode } from '@/lib/BOTBarcode'

export interface BOTBarcodeConfig {
  /** Biller ID (Tax ID + Suffix) */
  billerId: string

  /** Reference No. 1 / Customer No. */
  ref1: string

  /** Reference No. 2 */
  ref2?: string | null

  /** Transaction amount */
  amount?: number | null
}

/**
 * Generate BOT Barcode
 *
 * @returns Barcode Payload
 */
export function botBarcode({ billerId, ref1, ref2, amount }: BOTBarcodeConfig) {
  return new BOTBarcode(billerId, ref1, ref2, amount).toString()
}
