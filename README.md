![PromptParse](https://github.com/maythiwat/promptparse/assets/23092256/889e8f80-b1b3-44b2-ace5-ffbbce6e673b)

# PromptParse [![npm version](https://badge.fury.io/js/promptparse.svg)](https://badge.fury.io/js/promptparse)

"All-in-one JS library for PromptPay & EMVCo QR Codes"

No dependency & Cross-platform. You can use it anywhere (Node.js, Deno, Bun), even in the browser!

## Features

- **Parse** &mdash; PromptPay & EMVCo QR Code data strings into object
- **Generate** &mdash; QR Code data from pre-made templates (for example: PromptPay AnyID, PromptPay Bill Payment, TrueMoney, etc.)
- **Manipulate** &mdash; any values from parsed QR Code data (for example: transfer amount, account number) and encodes back into QR Code data
- **Validate** &mdash; checksum and data structure for known QR Code formats (for example: Slip Verify API Mini QR)

## Usage

### Parsing data and get value from tag

```ts
import { parse } from 'promptparse'

// Example data
const ppqr = parse('000201010211...')

// Get Value of Tag ID '00'
ppqr.getTagValue('00') // Returns '01'
```

### Build QR data and append CRC tag

```ts
import { encode, tag, withCrcTag } from 'promptparse'

// Example data
const data = [
  tag('00', '01'),
  tag('01', '11'),
  // ...
]

// Set CRC Tag ID '63'
withCrcTag(encode(data), '63') // Returns '000201010211...'
```

### Generate PromptPay Bill Payment QR

```ts
import { billPayment } from 'promptparse/generate'

const payload = billPayment({
  billerId: '1xxxxxxxxxxxx',
  amount: 300.0,
  ref1: 'INV12345',
})

// TODO: Create QR Code from payload
```

### Validate & extract data from Slip Verify QR

```ts
import { slipVerify } from 'promptparse/validate'

const data = slipVerify('00550006000001...')

if (!data) {
  console.error('Invalid Payload')
}

const { sendingBank, transRef } = data

// TODO: Inquiry transaction from Bank Open API
```

### Convert BOT Barcode to PromptPay QR Tag 30 (Bill Payment)

```ts
import { parseBarcode } from 'promptparse'

const botBarcode = parseBarcode('|310109999999901\r...')

if (!botBarcode) {
  console.error('Invalid Payload')
}

const payload = botBarcode.toQrTag30()

// TODO: Create QR Code from payload
```

### Use on browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/promptparse"></script>

<script>
  ;(function () {
    // Generate QR code payload (use function from "promptparse" global)
    const payload = promptparse.generate.truemoney({
      mobileNo: '08xxxxxxxx',
      amount: 10.0,
      message: 'Hello World!',
    })

    // Quick & dirty way to show QR Code image
    document.write(
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payload}">`,
    )
  })()
</script>
```

## References

- [EMV QR Code](https://www.emvco.com/emv-technologies/qrcodes/)
- [Thai QR Payment Standard](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2562/ThaiPDF/25620084.pdf)
- [Slip Verify API Mini QR Data](https://developer.scb/assets/documents/documentation/qr-payment/extracting-data-from-mini-qr.pdf)
- [BOT Barcode Standard](https://www.bot.or.th/content/dam/bot/documents/th/our-roles/payment-systems/about-payment-systems/Std_Barcode.pdf)

## See also

- [phoomin2012/promptparse-php](https://github.com/phoomin2012/promptparse-php) PromptParse port for PHP

## License

This project is MIT licensed (see [LICENSE.md](LICENSE.md))
