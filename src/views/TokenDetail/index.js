import React from 'react'
import Button from '@material-ui/core/Button'
import ValidateWeb3Injector from '../../injectors/ValidateWeb3Injector'
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

  networkName = (networkId) => {
    switch (networkId) {
      case 4:
        return 'rinkeby'
      case 42:
        return 'kovan'
      default:
        return null
    }
  }

  handleOtherDappsClick = () => {
    window.open(`https://drip-samples.github.io/llllll-sample-bandstar${this.props.history.location.pathname}`, '_blank')
  }

  componentDidMount() {
    const { networkId, currentAddress } = this.props
    const { tokenId } = this.props.match.params
    const { SixPillars } = ContractData
    const sixPillars = new this.props.web3.eth.Contract(SixPillars.abi, SixPillars.addresses[networkId])

    if (Number.isNaN(parseInt(tokenId, 16))) {
      this.setState({isNotFound: true})
      return
    }

    let owner, creator
    sixPillars.methods.ownerOf(tokenId).call({from: currentAddress})
      .then((result) => {
        owner = result
        return sixPillars.methods.creator(tokenId).call({from: currentAddress})
      })
      .then((result) => {
        creator = result
        return sixPillars.methods.inscription(tokenId).call({from: currentAddress})
      })
      .then((result) => {
        const bn = new this.props.web3.utils.BN(result)
        const inscription = ("0000000000000000000000000000000000000000000000000000000000000000" + bn.toString(16)).slice(-64)
        const model = TokenModel.decode(tokenId, owner, creator, inscription, networkId)
        if (model != null) {
          model.alreadyDisplay()
          this.setState({tokenModel: model})
        } else {
          this.setState({isNotFound: true})
        }
      })
  }

  render() {
    const { tokenModel, isNotFound } = this.state
    const shareUrl = `${window.location.origin}/llllll-sample-dragons/${this.networkName(this.props.networkId)}/tokens/${this.props.match.params.tokenId}`
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
                Share URL
                <br />
                <a href={shareUrl} alt='share token url'>{shareUrl}</a>
              </div>
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

export default ValidateWeb3Injector(TokenDetail)
