/*
* Refs:
* - https://www.blognone.com/node/95133
* - https://www.emvco.com/emv-technologies/qrcodes/
* - https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Documents/ThaiQRCode_Payment_Standard.pdf
*/

export enum BotTag {
  PAYLOAD_FORMAT = '00', //Payload Format Indicator
  POI_METHOD = '01', // Point of Initiation method
  CREDIT_TRANSFER = '29', // 29 - 51 is Merchant identifier
  BILL_PAYMENT = '30',
  INNOVATION_API = '31',
  MERCHANT_CATEGORY = '52',
  TRANSACTION_CURRENCY = '53',
  TRANSACTION_AMOUNT = '54',
  TIP = '55',
  CONVENIENCE_FEE_FIXED = '56',
  CONVENIENCE_FEE_PERCENTAGE = '57',
  COUNTRY_CODE = '58',
  MERCHANT_NAME = '59',
  MERCHANT_CITY = '60',
  POSTAL_CODE = '61',
  ADDITIONAL_DATA = '62',
  CRC = '63',
  MERCHANT_INFORMATION_TEMPLATE = '64',
  TQRC = '80',
}

export enum PayloadFormat { // [00] Payload Format Indicator
  EMV_PRESENTED = '01',
}

export enum POIMethod { // [01] Point of Initiation method
  STATIC = '11',
  DYNAMIC = '12',
}

export enum CreditTransferId {
  AID = '00',
  PHONE_NUMBER = '01',
  TAX_ID = '02',
  E_WALLET_ID = '03',
  BANK_ACCOUNT = '04',
  OTA = '05',
}

export enum BillTransferId {
  AID = '00',
  BILLER_ID = '01',
  REF1 = '02',
  REF2 = '03'
}

export enum AID {
  INNOVATION_API = 'A000000677012004',
  CROSS_BORDER = 'A000000677012006',
  MERCHANT_PRESENTED = 'A000000677010111',
  DOMESTIC = 'A000000677010112', //Bill Presented
  INNOVATION = 'A000000677010113',
  CUSTOMER_PRESENTED = 'A000000677010114'
}

export enum CountryCode {
  TH = 'TH',
}

export enum CurrencyCode {
  THB = '764',
}
