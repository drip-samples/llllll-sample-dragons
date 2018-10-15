import React from 'react'
import TokenType from '../../enums/TokenType'
import imageWhiteDragon from '../../assets/img/fantasy_dragon_white.png'
import imageBlackDragon from '../../assets/img/fantasy_dragon_black.png'
import imageRedDragon from '../../assets/img/fantasy_dragon_red.png'
import imageGreenDragon from '../../assets/img/fantasy_dragon_green.png'
import imageBlueDragon from '../../assets/img/fantasy_dragon_blue.png'
import imageYellowDragon from '../../assets/img/fantasy_dragon_yellow.png'
import imageRedJewel from '../../assets/img/jewel07_ruby.png'
import imageGreenJewel from '../../assets/img/jewel05_emerald.png'
import imageBlueJewel from '../../assets/img/jewel09_sapphire.png'
import imageYellowJewel from '../../assets/img/jewel11_citrine.png'

class TokenIcon extends React.Component {
  render() {
    const {tokenModel, ...remainProps} = this.props
    let src
    switch (tokenModel.tokenType) {
      case TokenType.whiteDragon:
        src = imageWhiteDragon
        break
      case TokenType.blackDragon:
        src = imageBlackDragon
        break
      case TokenType.redDragon:
        src = imageRedDragon
        break
      case TokenType.greenDragon:
        src = imageGreenDragon
        break
      case TokenType.blueDragon:
        src = imageBlueDragon
        break
      case TokenType.yellowDragon:
        src = imageYellowDragon
        break
      case TokenType.redJewel:
        src = imageRedJewel
        break
      case TokenType.greenJewel:
        src = imageGreenJewel
        break
      case TokenType.blueJewel:
        src = imageBlueJewel
        break
      case TokenType.yellowJewel:
        src = imageYellowJewel
        break
    }
    return <img src={src} {...remainProps} />
  }
}

export default TokenIcon
