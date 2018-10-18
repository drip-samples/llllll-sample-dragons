import React from 'react'
import Button from '@material-ui/core/Button'
import NetworkName from '../../enums/NetworkName'
import TokenTypeChip from '../../components/TokenTypeChip'

class HowTo extends React.Component {
  render() {
    return (
      <div>
        <h1>How to Play</h1>
        <hr />
        <p>
          <h2>{"Let's create a Almighty Dragon!"}</h2>
          This sample works with browsers with Ethereum Wallet functions.<br />
          and, it is necessary to be connected to one of the following any TestNet.
          <ul>
            {
              Object.keys(NetworkName).filter((key) => key !== '5777').map((key) => (
                <li>{NetworkName[key]}</li>
              ))
            }
          </ul>
        </p>
        <p>
          <h3>Step1</h3>
          Click <Button variant="outlined">
            Create Dragon Token
          </Button> to create a Dragon token.<br />
          You can create as many Dragon tokens as you like.<br />
          (Transaction fee is required for creation.)
        </p>
        <p>
          <h3>Step2</h3>
          Click <Button variant="outlined" color="primary">
            Start Dragon Mix
          </Button> to select multiple Dragon tokens required for mixing the dragons.<br />
          You can also use Jewel for mixing.<br />
          {"You can't select Dragon tokens that you used once, and not possible to synthesize only Jewel."}
        </p>
        <p>
          <h3>Step3</h3>
          Click <Button variant="outlined" color="secondary">
            Submit Dragon Mix
          </Button> to mixing the dragons.<br />
          The mixing dragon is created as a new Dragon token.<br />
          (Transaction fee is required to mix the dragons.)
        </p>
        <p>
          <h3>Step4</h3>
          Share your dragon URL and be proud of about your dragon!
        </p>
        <p>
          <h3>Step5</h3>
          The Dragon token is available for <a href='https://6-pillars.ooo/' alt='|||||| 6 pillars' target='_blank' rel="noopener noreferrer">
            |||||| - 6 pillars
          </a> compliant DApps.<br />
          Click <Button variant="outlined">
            BandStar
          </Button> to see what your Dragon token is in other DApps!
        </p>
      </div>
    )
  }
}

export default HowTo
