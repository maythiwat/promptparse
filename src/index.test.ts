import { expect, test } from 'vitest'

import {
  parse,
  generate,
  validate,
  parseBarcode,
  checksum,
  decode,
  tag,
  withCrcTag,
} from '.'

test('Invalid string passed to parser', () => {
  expect(parse('AAAA0000')).toBeFalsy()
})

test('Parse TLV and get tag count', () => {
  expect(parse('000411110104222202043333')?.getTags()).toHaveLength(3)
})

test('Parse TLV and get one tag', () => {
  expect(parse('000411110104222202043333')?.getTag('01')?.value).toBe('2222')
})

test('Parse payload (strict) with invalid checksum', () => {
  expect(
    parse(
      '00020101021229370016A0000006770101110113006680111111153037645802TH540520.156304FFFF',
      true,
    ),
  ).toBeFalsy()
})

test('Parse payload (strict) with valid checksum and get tag value', () => {
  expect(
    parse(
      '00020101021229370016A0000006770101110113006680111111153037645802TH540520.15630442BE',
      true,
    )?.getTagValue('29', '01'),
  ).toBe('0066801111111')
})

test('Generate Any ID', () => {
  expect(
    generate.anyId({
      type: 'MSISDN',
      target: '0812223333',
    }),
  ).toBe(
    '00020101021129370016A0000006770101110113006681222333353037645802TH63041DCF',
  )
})

test('Generate Any ID with amount', () => {
  expect(
    generate.anyId({
      type: 'MSISDN',
      target: '0812223333',
      amount: 30,
    }),
  ).toBe(
    '00020101021229370016A0000006770101110113006681222333353037645802TH540530.0063043CAD',
  )
})

test('Generate Slip Verify', () => {
  expect(
    generate.slipVerify({
      sendingBank: '002',
      transRef: '0002123123121200011',
    }),
  ).toBe('004000060000010103002021900021231231212000115102TH91049C30')
})

test('Generate TrueMoney QR', () => {
  expect(
    generate.trueMoney({
      mobileNo: '0801111111',
    }),
  ).toBe(
    '00020101021129390016A000000677010111031514000080111111153037645802TH63047C0F',
  )
})

test('Generate TrueMoney QR with amount and message', () => {
  expect(
    generate.trueMoney({
      mobileNo: '0801111111',
      amount: 10.05,
      message: 'Hello World!',
    }),
  ).toBe(
    '00020101021229390016A000000677010111031514000080111111153037645802TH540510.05814800480065006C006C006F00200057006F0072006C006400216304F5A2',
  )
})

test('Generate Bill Payment with Ref.3', () => {
  expect(
    generate.billPayment({
      billerId: '0112233445566',
      ref1: 'CUSTOMER001',
      ref2: 'INV001',
      ref3: 'SCB',
    }),
  ).toBe(
    '00020101021130620016A000000677010112011301122334455660211CUSTOMER0010306INV00153037645802TH62070703SCB6304780E',
  )
})

test('Generate BOT Barcode', () => {
  expect(
    generate.botBarcode({
      billerId: '099999999999990',
      ref1: '111222333444',
    }),
  ).toBe('|099999999999990\r111222333444\r\r0')
})

test('Generate BOT Barcode with Ref.2 and amount', () => {
  expect(
    generate.botBarcode({
      billerId: '099400016550100',
      ref1: '123456789012',
      ref2: '670429',
      amount: 3649.22,
    }),
  ).toBe('|099400016550100\r123456789012\r670429\r364922')
})

test('Validate checksum tag', () => {
  expect(
    parse(
      '00020101021229370016A0000006770101110113006680111111153037645802TH540520.15630442BE',
      false,
    )?.validate('63'),
  ).toBe(true)
})

test('Validate Slip Verify (Valid)', () => {
  expect(
    validate.slipVerify(
      '004100060000010103014022000111222233344ABCD125102TH910417DF',
    ),
  ).toEqual({
    sendingBank: '014',
    transRef: '00111222233344ABCD12',
  })
})

test('Validate Slip Verify (Invalid)', () => {
  expect(
    validate.slipVerify(
      '00020101021229370016A0000006770101110113006680111111153037645802TH540520.15630442BE',
    ),
  ).toBeFalsy()
})

test('Convert BOT Barcode to Bill Payment (Valid)', () => {
  expect(parseBarcode('|099999999999990\r111222333444\r\r0')?.toQrTag30()).toBe(
    '00020101021130550016A0000006770101120115099999999999990021211122233344453037645802TH63043EE7',
  )
})

test('Convert BOT Barcode to Bill Payment (Valid, with Ref.2 and amount)', () => {
  expect(
    parseBarcode('|099400016550100\r123456789012\r670429\r364922')?.toQrTag30(),
  ).toBe(
    '00020101021230650016A00000067701011201150994000165501000212123456789012030667042953037645802TH54073649.2263044534',
  )
})

test('Convert BOT Barcode to Bill Payment (Invalid, wrong payload)', () => {
  expect(
    parseBarcode(
      '00020101021230650016A00000067701011201150994000165501000212123456789012030667042953037645802TH54073649.2263044534',
    )?.toQrTag30(),
  ).toBeFalsy()
})

test('Convert BOT Barcode to Bill Payment (Invalid, data loss)', () => {
  expect(
    parseBarcode('|099400016550100\r123456789012\r670429')?.toQrTag30(),
  ).toBeFalsy()
})

test('Validate AnyID (MSISDN, no amount)', () => {
  expect(
    validate.anyId(generate.anyId({ type: 'MSISDN', target: '0812223333' })),
  ).toEqual({ type: 'MSISDN', target: '0812223333' })
})

test('Validate AnyID (MSISDN, with amount)', () => {
  expect(
    validate.anyId(
      generate.anyId({ type: 'MSISDN', target: '0812223333', amount: 30 }),
    ),
  ).toEqual({ type: 'MSISDN', target: '0812223333', amount: 30 })
})

test('Validate AnyID (NATID)', () => {
  expect(
    validate.anyId(generate.anyId({ type: 'NATID', target: '1234567890123' })),
  ).toEqual({ type: 'NATID', target: '1234567890123' })
})

test('Validate AnyID (Invalid, slip verify payload)', () => {
  expect(
    validate.anyId(
      '004000060000010103002021900021231231212000115102TH91049C30',
    ),
  ).toBeFalsy()
})

test('Validate Bill Payment (no optional fields)', () => {
  expect(
    validate.billPayment(
      generate.billPayment({ billerId: '0112233445566', ref1: 'CUSTOMER001' }),
    ),
  ).toEqual({ billerId: '0112233445566', ref1: 'CUSTOMER001' })
})

test('Validate Bill Payment (with ref2, ref3 and amount)', () => {
  expect(
    validate.billPayment(
      generate.billPayment({
        billerId: '0112233445566',
        ref1: 'CUSTOMER001',
        ref2: 'INV001',
        ref3: 'SCB',
        amount: 250,
      }),
    ),
  ).toEqual({
    billerId: '0112233445566',
    ref1: 'CUSTOMER001',
    ref2: 'INV001',
    ref3: 'SCB',
    amount: 250,
  })
})

test('Validate Bill Payment (Invalid, AnyID payload)', () => {
  expect(
    validate.billPayment(
      generate.anyId({ type: 'MSISDN', target: '0812223333' }),
    ),
  ).toBeFalsy()
})

test('Checksum of UTF-8 string (2-byte, 3-byte and 4-byte sequences)', () => {
  expect(checksum('Café')).toBe('8FDF')
  expect(checksum('ร้านทดสอบ')).toBe('1EA0')
  expect(checksum('a\u{1F600}b')).toBe('BF6B')
})

test('Checksum of string with unpaired surrogate', () => {
  expect(checksum('lone\uD800x')).toBe('64F6')
})

test('Parse payload (strict) with UTF-8 merchant name', () => {
  const payload =
    '00020101021129370016A0000006770101110113006681222333353037645802TH5909ร้านทดสอบ6007กรุงเทพ63048A01'

  const qr = parse(payload, true)
  expect(qr?.getTagValue('59')).toBe('ร้านทดสอบ')
  expect(qr?.getTagValue('60')).toBe('กรุงเทพ')
  expect(qr?.getTagValue('63')).toBe('8A01')
  expect(parse(payload.slice(0, -4) + 'FFFF', true)).toBeFalsy()
})

test('Parse bill payment with Thai merchant name (length in characters)', () => {
  const qr = parse(
    withCrcTag(
      '00020101021230590016A00000067701011201150999999999999990206REF0010306REF00253037645802TH5905ทดสอบ62070703001',
      '63',
    ),
    true,
  )
  expect(qr?.getTagValue('30', '01')).toBe('099999999999999')
  expect(qr?.getTagValue('59')).toBe('ทดสอบ')
  expect(qr?.getTagValue('62', '07')).toBe('001')
})

test('Length counts code points, not UTF-16 code units', () => {
  // '𠀋' is outside the BMP: 1 code point, 2 UTF-16 code units
  const qr = parse(
    withCrcTag('00020101021153037645802TH5905𠀋テスト店6008TESTCITY', '63'),
    true,
  )
  expect(qr?.getTagValue('59')).toBe('𠀋テスト店')
  expect(qr?.getTagValue('60')).toBe('TESTCITY')
  expect(tag('59', '𠀋テスト店').length).toBe(5)
})

test('Reject payload whose declared length runs past the end', () => {
  // valid CRC over the raw string, but tag 60 declares 20 where only 16 remain
  expect(
    parse(
      withCrcTag('00020101021153037645802TH5909FAKE SHOP6020TESTCITY', '63'),
      true,
    ),
  ).toBeNull()
  expect(parse('000411110104222202103333')).toBeNull()
})

test('Reject malformed TLV header', () => {
  expect(parse('0004111101X4222202043333')).toBeNull()
  expect(parse('000411110104222202')).toBeNull()
  expect(parse('0004111101002222')).toBeNull()
  expect(decode('0004111101')).toEqual([])
})

test('Reject strict payload whose last tag is not a 4-character CRC', () => {
  const body = '000201010211'
  const crc = checksum(body + '6304')
  expect(parse(body + '6304' + crc, true)).toBeTruthy()
  // CRC matches the last 4 characters, but they sit inside a 6-character tag
  const head = body + '6206ab'
  expect(parse(head + checksum(head), true)).toBeNull()
})

test('Do not attach sub-tags when value is not a valid template', () => {
  const qr = parse('00020101021259080102ABCD')
  expect(qr?.getTag('59')?.subTags).toBeUndefined()
})
