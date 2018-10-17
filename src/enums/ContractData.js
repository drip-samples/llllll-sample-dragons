const SixPillars = require("../contracts/SixPillars.json")
const Dragon = require("../contracts/Dragon.json")

export default {
  SixPillars: {
    abi: SixPillars['abi'],
    addresses: {
      4: '0x542A900357c9638AD6e944a57072c5D01f1C1Ea7',
      42: '0x542A900357c9638AD6e944a57072c5D01f1C1Ea7',
      5777: SixPillars['networks']['5777']['address'],
    },
  },
  Dragon: {
    abi: Dragon['abi'],
    addresses: {
      4: null,
      42: null,
      5777: Dragon['networks']['5777']['address'],
    },
  },
}
