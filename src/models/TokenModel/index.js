import TokenType from '../../enums/TokenType'

const IS_ALREADY_DISPLAY_KEY = 'IS_ALREADY_DISPLAY_KEY_'
const IS_ALREADY_MIXED_KEY = 'IS_ALREADY_MIXED_KEY_'
const TRUE_VALUE = 'true'

class TokenModel {
  constructor() {
    this.id = null
    this.owner = null
    this.creator = null
    this.inscription = null
    this.tokenType = null
    this.fullLength = 0
    this.bodyWeight = 0
    this.power = 0
    this.speed = 0
    this.vitality = 0
    this.intellect = 0
    this.isAlreadyDisplay = false
    this.isAlreadyMixed = false
  }

  static isAlreadyMixed(id) {
    return window.localStorage.getItem(IS_ALREADY_MIXED_KEY + `0x${id.slice(-64)}`.toLowerCase()) === TRUE_VALUE
  }

  static decodeTokenType(model, inscription) {
    const i = 11
    const byte = inscription.substr(-((i + 1) * 2), 2)
    const keys = Object.keys(TokenType)
    model.tokenType = TokenType[keys[parseInt(byte, 16) % keys.length] ]
  }

  static decodeTokenTypeOnlyJewel(model, inscription) {
    const i = 11
    const byte = inscription.substr(-((i + 1) * 2), 2)
    const values = [
      TokenType.redJewel,
      TokenType.greenJewel,
      TokenType.blueJewel,
      TokenType.yellowJewel,
    ]
    model.tokenType = values[parseInt(byte, 16) % values.length]
  }

  static decodeForDragon(model, inscription) {
    const toByte = (inscription, i) => { return parseInt(inscription.substr(-((i + 1) * 2), 2), 16) }
    let fullLengthCount = (toByte(inscription, 10) % 2) + 1
    let bodyWeightCount = (toByte(inscription, 29) % 2) + 1
    let powerCount = (toByte(inscription, 12) % 4) + 1
    let speedCount = (toByte(inscription, 23) % 4) + 1
    let vitalityCount = (toByte(inscription, 22) % 4) + 1
    let intellectCount = (toByte(inscription, 30) % 4) + 1

    for (let i = 0; i < 32; i++) {
      const byte = toByte(inscription, i)
      switch (i) {
        case 1:
        case 2:
        case 3:
        case 4:
          if ((i - 1) < intellectCount) {
            model.intellect += (byte * (1 << ((i - 1) * 8)))
          }
          break
        case 5:
        case 6:
          if ((i - 5) < fullLengthCount) {
            model.fullLength += (byte * (1 << ((i - 5) * 8)))
          }
          break
        case 8:
        case 9:
          if ((i - 8) < bodyWeightCount) {
            model.bodyWeight += (byte * (1 << ((i - 8) * 8)))
          }
          break
        case 13:
        case 14:
        case 15:
        case 16:
          if ((i - 13) < speedCount) {
            model.speed += (byte * (1 << ((i - 13) * 8)))
          }
          break
        case 17:
        case 18:
        case 19:
        case 20:
          if ((i - 17) < vitalityCount) {
            model.vitality += (byte * (1 << ((i - 17) * 8)))
          }
          break
        case 25:
        case 26:
        case 27:
        case 28:
          if ((i - 25) < powerCount) {
            model.power += (byte * (1 << ((i - 25) * 8)))
          }
          break
        default:
          break
      }
    }
  }

  static decodeForJewel(model, inscription) {
    const toByte = (inscription, i) => { return parseInt(inscription.substr(-((i + 1) * 2), 2), 16) }
    model.power = toByte(inscription, 25) * ((toByte(inscription, 26) % 8) + 3)
    model.speed = toByte(inscription, 13) * ((toByte(inscription, 14) % 8) + 3)
    model.vitality = toByte(inscription, 17) * ((toByte(inscription, 18) % 8) + 3)
    model.intellect = toByte(inscription, 1) * ((toByte(inscription, 2) % 8) + 3)
  }

  static decode(id, owner, creator, inscription, contractAddress) {
    // validate
    if ((id === null)
      || (id.length === 0)
      || (owner === null)
      || (owner.length === 0)
      || (creator === null)
      || (creator.length === 0)
      || (inscription === null)
      || (inscription.length === 0))
    {
      return null
    }

    const model = new TokenModel()
    model.id = `0x${id.slice(-64)}`
    model.owner = owner
    model.creator = creator
    model.inscription = `0x${inscription.slice(-64)}`

    if (creator.toLowerCase() === contractAddress.toLowerCase()) {
      this.decodeTokenType(model, inscription)

    } else {
      this.decodeTokenTypeOnlyJewel(model, inscription)
    }


    if (model.isDragon()) {
      this.decodeForDragon(model, inscription)

    } else {
      this.decodeForJewel(model, inscription)
    }

    model.isAlreadyMixed = (window.localStorage.getItem(IS_ALREADY_MIXED_KEY + model.id.toLowerCase()) === TRUE_VALUE)
    model.isAlreadyDisplay = (window.localStorage.getItem(IS_ALREADY_DISPLAY_KEY + model.id.toLowerCase()) === TRUE_VALUE)

    return model
  }

  static mint() {
    const model = new TokenModel()

    const enableTokenTypes = [
      TokenType.whiteDragon,
      TokenType.blackDragon,
    ]
    model.tokenType = enableTokenTypes[Math.floor(Math.random() * enableTokenTypes.length)]

    model.fullLength = Math.floor(Math.random() * 0xfe) + 1
    model.bodyWeight = Math.floor(Math.random() * 0xfe) + 1
    model.power = Math.floor(Math.random() * 0xfe) + 1
    model.speed = Math.floor(Math.random() * 0xfe) + 1
    model.vitality = Math.floor(Math.random() * 0xfe) + 1
    model.intellect = Math.floor(Math.random() * 0xfe) + 1

    return model
  }

  static mixedMint(tokenModels) {
    const model = new TokenModel()

    let submitTokenType = tokenModels.map((model) => {
      switch (model.tokenType) {
        case TokenType.redJewel:
          return TokenType.redDragon
        case TokenType.greenJewel:
          return TokenType.greenDragon
        case TokenType.blueJewel:
          return TokenType.blueDragon
        case TokenType.yellowJewel:
          return TokenType.yellowDragon
        default:
          return model.tokenType
      }
    })

    model.tokenType = submitTokenType[Math.floor(Math.random() * submitTokenType.length)]

    const sum = (add, current) => { return current + add }
    model.fullLength = tokenModels.filter((m) => m.isDragon()).map((m) => m.fullLength).reduce(sum)
    model.fullLength = (model.fullLength < 0xffff) ? model.fullLength : 0xffff
    model.bodyWeight = tokenModels.filter((m) => m.isDragon()).map((m) => m.bodyWeight).reduce(sum)
    model.bodyWeight = (model.bodyWeight < 0xffff) ? model.bodyWeight : 0xffff
    model.power = tokenModels.filter((m) => m.isDragon() || m.tokenType === TokenType.redJewel).map((m) => m.power).reduce(sum)
    model.power = (model.power < 0xffffffff) ? model.power : 0xffffffff
    model.speed = tokenModels.filter((m) => m.isDragon() || m.tokenType === TokenType.blueJewel).map((m) => m.speed).reduce(sum)
    model.speed = (model.speed < 0xffffffff) ? model.speed : 0xffffffff
    model.vitality = tokenModels.filter((m) => m.isDragon() || m.tokenType === TokenType.greenJewel).map((m) => m.vitality).reduce(sum)
    model.vitality = (model.vitality < 0xffffffff) ? model.vitality : 0xffffffff
    model.intellect = tokenModels.filter((m) => m.isDragon() || m.tokenType === TokenType.yellowJewel).map((m) => m.intellect).reduce(sum)
    model.intellect = (model.intellect < 0xffffffff) ? model.intellect : 0xffffffff

    return model
  }

  byteForInscription(index, max) {
    const mul = Math.floor(0xff / max)
    return (Math.floor(Math.random() * mul) * max) + index
  }

  encode() {
    let fullLengthCount = Math.ceil(this.fullLength.toString(16).length / 2)
    let bodyWeightCount = Math.ceil(this.bodyWeight.toString(16).length / 2)
    let powerCount = Math.ceil(this.power.toString(16).length / 2)
    let speedCount = Math.ceil(this.speed.toString(16).length / 2)
    let vitalityCount = Math.ceil(this.vitality.toString(16).length / 2)
    let intellectCount = Math.ceil(this.intellect.toString(16).length / 2)

    let inscription = ""
    for (let i = 0; i < 32; i++) {
      switch (i) {
        case 1:
        case 2:
        case 3:
        case 4:
          if ((i - 1) < intellectCount) {
            inscription = ("00000000" + this.intellect.toString(16)).substr(-((i - 1 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 5:
        case 6:
          if ((i - 5) < fullLengthCount) {
            inscription = ("00000000" + this.fullLength.toString(16)).substr(-((i - 5 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 8:
        case 9:
          if ((i - 8) < bodyWeightCount) {
            inscription = ("00000000" + this.bodyWeight.toString(16)).substr(-((i - 8 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 10:
          inscription = ("00" + this.byteForInscription(fullLengthCount - 1, 2).toString(16)).slice(-2) + inscription
          break
        case 11:
        {
          const keys = Object.keys(TokenType)
          const targetKey = keys.filter((key) => { return TokenType[key] === this.tokenType })[0]
          inscription = ("00" + this.byteForInscription(keys.indexOf(targetKey), keys.length).toString(16)).slice(-2) + inscription
        }
          break
        case 12:
          inscription = ("00" + this.byteForInscription(powerCount - 1, 4).toString(16)).slice(-2) + inscription
          break
        case 13:
        case 14:
        case 15:
        case 16:
          if ((i - 13) < speedCount) {
            inscription = ("00000000" + this.speed.toString(16)).substr(-((i - 13 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 17:
        case 18:
        case 19:
        case 20:
          if ((i - 17) < vitalityCount) {
            inscription = ("00000000" + this.vitality.toString(16)).substr(-((i - 17 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 22:
          inscription = ("00" + this.byteForInscription(vitalityCount - 1, 4).toString(16)).slice(-2) + inscription
          break
        case 23:
          inscription = ("00" + this.byteForInscription(speedCount - 1, 4).toString(16)).slice(-2) + inscription
          break
        case 25:
        case 26:
        case 27:
        case 28:
          if ((i - 25) < powerCount) {
            inscription = ("00000000" + this.power.toString(16)).substr(-((i - 25 + 1) * 2), 2) + inscription
          } else {
            inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          }
          break
        case 29:
          inscription = ("00" + this.byteForInscription(bodyWeightCount - 1, 2).toString(16)).slice(-2) + inscription
          break
        case 30:
          inscription = ("00" + this.byteForInscription(intellectCount - 1, 4).toString(16)).slice(-2) + inscription
          break
        default:
          inscription = ("00" + Math.floor(Math.random() * 0xff).toString(16)).slice(-2) + inscription
          break
      }
    }
    return `0x${inscription}`
  }

  alreadyDisplay() {
    this.isAlreadyDisplay = true
    window.localStorage.setItem(IS_ALREADY_DISPLAY_KEY + this.id.toLowerCase(), TRUE_VALUE)
  }

  alreadyMixed() {
    this.isAlreadyMixed = true
    window.localStorage.setItem(IS_ALREADY_MIXED_KEY + this.id.toLowerCase(), TRUE_VALUE)
  }

  isDragon() {
    switch (this.tokenType) {
      case TokenType.whiteDragon:
      case TokenType.blackDragon:
      case TokenType.redDragon:
      case TokenType.greenDragon:
      case TokenType.blueDragon:
      case TokenType.yellowDragon:
        return true
      default:
        return false
    }
  }
}

export default TokenModel
