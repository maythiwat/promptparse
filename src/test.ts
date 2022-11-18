// import { generate } from './generators/PromptPayAnyID';
import { generate } from './generators/PromptPayBill';
import { decode } from './index';
const data = generate("010753600010286",100.00,"014000005281472","1002545")
// const data = generate('0882433029', 10)
console.log(data)
// console.log('A', decode('00020101021229370016A000000677010111011300668824330295802TH5303764540510.006304AB97'), 'B', decode(data))

