![PromptParse](https://user-images.githubusercontent.com/61514399/202692697-c6bbade6-f5b4-4a60-8989-5d80ba31f58e.png)

# PromptParse
💸 PromptPay (and EMVCo-compatible) QR Code Payload Parser and Generator

## Features
- Parses PromptPay or other EMVCo-compatible QR Code Data
- Construct TLV Tags into QR Code Data (uses to create QR Code)
- Pre-made generators for PromptPay and other Thai QR Standards (and non-standards)

## Usage
### Parsing data and get value from tag
```ts
import { parse } from 'promptparse'

// Example data
const ppqr = parse('000201010211...')

// Get Tag ID '00'
ppqr.getTagValue('00') // Returns '01'
```

### Build QR data
```ts
import { encode, tag, withCrcTag } from 'promptparse'

// Example data
const data = [
  tag('00', '01'),
  tag('01', '11'),
  // ...
]

// Set CRC Tag ID '63'
withCrcTag(encode(data), '63') // Retruns '000201010211...'
```

## References
- [EMV QR Code](https://www.emvco.com/emv-technologies/qrcodes/)
- [Thai QR Payment Standard](https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Documents/ThaiQRCode_Payment_Standard.pdf)
- [Slip Verify API Mini QR Data](https://developer.scb/assets/documents/documentation/qr-payment/extracting-data-from-mini-qr.pdf)

## License
This project is MIT licensed (see [LICENSE.md](LICENSE.md))