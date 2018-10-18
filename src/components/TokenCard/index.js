import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CheckBox from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank'
import teal from '@material-ui/core/colors/teal'
import grey from '@material-ui/core/colors/grey'
import TokenType from '../../enums/TokenType'
import TokenIcon from '../TokenIcon'
import TokenTypeChip from '../TokenTypeChip'
import NewChip from '../NewChip'
import Loading from '../Loading'

class TokenCard extends React.Component {
  handleClick = () => {
    const {tokenModel, onClick} = this.props
    onClick(tokenModel)
  }

  render() {
    const {tokenModel, isMixedMode, isSelected} = this.props
    let cardStyle = {
      width: '100%',
    }
    if (tokenModel && tokenModel.isAlreadyMixed) {
      cardStyle.backgroundColor = grey['500']

    } else if (isMixedMode && isSelected) {
      cardStyle.backgroundColor = teal['100']
    }
    return (
      <Card onClick={this.handleClick}>
        <CardActionArea style={cardStyle}>
          {
            (tokenModel == null) ? (
              <CardContent>
                <div style={{float: 'left', height: '106px', marginBottom: '16px'}}>
                  <Loading />
                </div>
              </CardContent>

            ) : (
              <CardContent>
                <div style={{float: 'left', width: '106px', height: '106px', marginBottom: '16px'}}>
                  <TokenIcon tokenModel={tokenModel} style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%'}} />
                </div>
                <div style={{float: 'left'}}>
                  <ul style={{listStyle: 'none'}}>
                    <li>
                      {
                        !tokenModel.isAlreadyDisplay && (
                          <NewChip />
                        )
                      }
                      <TokenTypeChip tokenModel={tokenModel} />
                    </li>
                    {
                      (tokenModel.tokenType === TokenType.redJewel) ? (
                        <li>Power : {tokenModel.power}</li>

                      ) : (tokenModel.tokenType === TokenType.blueJewel) ? (
                        <li>Speed : {tokenModel.speed}</li>

                      ) : (tokenModel.tokenType === TokenType.greenJewel) ? (
                        <li>Vitality : {tokenModel.vitality}</li>

                      ) : (tokenModel.tokenType === TokenType.yellowJewel) ? (
                        <li>Intellect : {tokenModel.intellect}</li>

                      ) : (
                        <React.Fragment>
                          <li>Power : {tokenModel.power}</li>
                          <li>Speed : {tokenModel.speed}</li>
                          <li>Vitality : {tokenModel.vitality}</li>
                          <li>Intellect : {tokenModel.intellect}</li>
                        </React.Fragment>
                      )
                    }
                  </ul>
                </div>
                {
                  isMixedMode && !tokenModel.isAlreadyMixed && (
                    <div style={{float: 'right'}}>
                      { isSelected ? <CheckBox /> : <CheckBoxOutlineBlank /> }
                    </div>
                  )
                }
              </CardContent>
            )
          }
        </CardActionArea>
      </Card>
    )
  }
}

export default TokenCard
