const ethereum = {
  host: null,
  port: null,
  networkId: null,
  gas: null,
  gasPrice: null,
  SixPillars: {},
  Dragon: {},
}

let SixPillars
let Dragon

switch (process.env.REACT_APP_ENV) {
  default:
    ethereum.host = "localhost"
    ethereum.port = 7545
    ethereum.networkId = 5777
    ethereum.gas = 6721975
    ethereum.gasPrice = 20000000000
    SixPillars = require("./contracts/SixPillars.json")
    Dragon = require("./contracts/Dragon.json")
    break
}

console.log(SixPillars['networks'][String(ethereum.networkId)])
ethereum.SixPillars.abi = SixPillars['abi']
ethereum.SixPillars.address = SixPillars['networks'][String(ethereum.networkId)]['address']
ethereum.Dragon.abi = Dragon['abi']
ethereum.Dragon.address = Dragon['networks'][String(ethereum.networkId)]['address']

const config = {
  ethereum,
}

export default config
