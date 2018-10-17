import React from 'react'
import Chip from '@material-ui/core/Chip'

class TokenTypeChip extends React.Component {
  render() {
    const {tokenModel, ...remainProps} = this.props
    let label = tokenModel.isDragon() ? 'Dragon' : 'Jewel'
    return <Chip label={label} color='secondary' {...remainProps} />
  }
}

export default TokenTypeChip
