import React from 'react'
import Button from '@material-ui/core/Button'
import NetworkId from '../../enums/NetworkId'
import TokenType from '../../enums/TokenType'
import TokenModel from '../../models/TokenModel'
import TokenIcon from '../../components/TokenIcon'
import TokenTypeChip from '../../components/TokenTypeChip'
import Loading from '../../components/Loading'
import ContractData from '../../enums/ContractData'

class TokenDetail extends React.Component {
  state = {
    tokenModel: null,
    isNotFound: false,
  }

  salesFormatter = new Intl.NumberFormat('us-EN', {
    style: 'currency',
    currency: 'USD'
  })

  funFormatter = new Intl.NumberFormat('us-EN')

  actFormat = (act) => {
    if (act < 30) {
      const day = (act === 1) ? 'day' : 'days'
      return `${act} ${day}`

    } else if (act < 360) {
      const monthNum = Math.floor(act / 30)
      const month = (monthNum === 1) ? 'month' : 'months'
      const dayNum = act % 30
      if (dayNum === 0) {
        return `${monthNum} ${month}`

      } else if (dayNum === 1) {
        return `${monthNum} ${month}, 1 day`

      } else {
        return `${monthNum} ${month}, ${dayNum} days`
      }

    } else {
      const i = Math.floor(act / 30)
      const yearNum = Math.floor(i / 12)
      const year = (yearNum === 1) ? 'year' : 'years'
      const monthNum = i % 12
      if (monthNum === 0) {
        return `${yearNum} ${year}`

      } else if (monthNum === 1) {
        return `${yearNum} ${year}, 1 month`

      } else {
        return `${yearNum} ${year}, ${monthNum} months`
      }
    }
  }

  web3HttpUrl = (name) => {
    switch (name) {
      case 'kovan':
        return 'https://kovan.infura.io/ipN7Rvj4j0lzprCXMbql'
      case 'rinkeby':
        return 'https://rinkeby.infura.io/ipN7Rvj4j0lzprCXMbql'
      case 'ropsten':
        return 'https://ropsten.infura.io/ipN7Rvj4j0lzprCXMbql'
      case 'local':
        return 'http://localhost:7545'
      default:
        return null
    }
  }

  handleOtherDappsClick = () => {
    window.open(`https://drip-samples.github.io/llllll-sample-bandstar${this.props.history.location.pathname}`, '_blank')
  }

  componentDidMount() {
    const { tokenId, networkName } = this.props.match.params
    const networkId = NetworkId[networkName]
    const Web3 = require('web3')
    const web3 = new Web3(new Web3.providers.HttpProvider(this.web3HttpUrl(networkName)))
    const { SixPillars } = ContractData
    const sixPillars = new web3.eth.Contract(SixPillars.abi, SixPillars.addresses[networkId])

    if (Number.isNaN(parseInt(tokenId, 16))) {
      this.setState({isNotFound: true})
      return
    }

    let owner, creator
    sixPillars.methods.ownerOf(tokenId).call()
      .then((result) => {
        owner = result
        return sixPillars.methods.creator(tokenId).call()
      })
      .then((result) => {
        creator = result
        return sixPillars.methods.inscription(tokenId).call()
      })
      .then((result) => {
        const bn = new web3.utils.BN(result)
        const inscription = ("0000000000000000000000000000000000000000000000000000000000000000" + bn.toString(16)).slice(-64)
        const model = TokenModel.decode(tokenId, owner, creator, inscription, networkId)
        if (model != null) {
          this.setState({tokenModel: model})
        } else {
          this.setState({isNotFound: true})
        }
      })
  }

  render() {
    const { tokenModel, isNotFound } = this.state
    return (
      <div>
        <h1>Token Detail</h1>
        <div>{this.props.match.params.tokenId}</div>
        {
          (isNotFound === true) ? (
            <div>token not found</div>

          ) : (tokenModel !== null) ? (
            <React.Fragment>
              <div><TokenIcon tokenModel={tokenModel} style={{height: '200px'}} /></div>
              {
                tokenModel.isAlreadyMixed && (
                  <div style={{color: '#ff0000'}}>token is already used.</div>
                )
              }
              <div><TokenTypeChip tokenModel={tokenModel} /></div>
              {
                (tokenModel.tokenType === TokenType.redJewel) ? (
                  <div>Power : {tokenModel.power}</div>

                ) : (tokenModel.tokenType === TokenType.blueJewel) ? (
                  <div>Speed : {tokenModel.speed}</div>

                ) : (tokenModel.tokenType === TokenType.greenJewel) ? (
                  <div>Vitality : {tokenModel.vitality}</div>

                ) : (tokenModel.tokenType === TokenType.yellowJewel) ? (
                  <div>Intellect : {tokenModel.intellect}</div>

                ) : (
                  <React.Fragment>
                    <div>FullLength : {tokenModel.fullLength / 1000} m</div>
                    <div>BodyWeight : {tokenModel.bodyWeight / 1000} t</div>
                    <div>Power : {tokenModel.power}</div>
                    <div>Speed : {tokenModel.speed}</div>
                    <div>Vitality : {tokenModel.vitality}</div>
                    <div>Intellect : {tokenModel.intellect}</div>
                  </React.Fragment>
                )
              }
              <div style={{marginTop: '30px'}}>
                <Button variant="outlined" onClick={this.handleOtherDappsClick}>
                  BandStar
                </Button>
              </div>
            </React.Fragment>

          ) : (
            <Loading />
          )
        }
      </div>
    )
  }
}

export default TokenDetail
