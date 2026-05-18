import { parse } from '@/lib/parser'

/**
 * Validate & extract data from BCEL OneProof QR
 *
 * @param payload - QR Code Payload
 * @returns Type, Ticket No. and Reference No. or null if payload invalid
 */
export function bcelOneProof(payload: string) {
  const ppqr = parse(payload, true)

  const type = ppqr?.getTagValue('33', '02')
  const ticket = ppqr?.getTagValue('33', '03')
  const fccref = ppqr?.getTagValue('33', '04')

  if (
    ppqr?.getTagValue('00') !== '01' &&
    ppqr?.getTagValue('01') !== '11' &&
    ppqr?.getTagValue('33', '00') !== 'BCEL' &&
    ppqr?.getTagValue('33', '00') !== 'ONEPROOF'
  ) {
    return null
  }

  return {
    type,
    ticket,
    fccref,
  }
}
