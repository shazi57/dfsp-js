import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import Link from 'next/link';

export default function SignInView(props) {
  const {
    signerAddr, onConnectButtonClicked, onNavigateClicked, inputAddress, onInputChanged,
  } = props;

  return (
    <div id="button-container">
      {
        !signerAddr
          && (
            <div id="place-holder">
              <h4>Connect your wallet to get started!</h4>
              <div id="wallet-button-container">
                <Button
                  id="button-wallet"
                  onClick={onConnectButtonClicked}
                  className="p-button-outlined p-button-secondary"
                >
                  Connect to MetaMask
                </Button>
              </div>
            </div>
          )
      }
      {
        signerAddr
          && (
            <div id="options-container">
              <div id="options-header">
                <div id="option-title">
                  <h4>
                    Start Streaming
                  </h4>
                </div>
                <div id="address-container">
                  <Button
                    id="button-wallet"
                    onClick={onConnectButtonClicked}
                    disabled
                    className="p-button-outlined p-button-sm p-button-info"
                  >
                    0x
                    {signerAddr.substring(0, 20)}
                    ...
                  </Button>
                </div>
              </div>
              <div
                id="button-row"
              >
                <Link href="/create">
                  <Button
                    className="p-button-outlined p-button pirmary"
                  >
                    Create a New Channel
                  </Button>
                </Link>
                <Link href={`/dashboard/${signerAddr}`}>
                  <Button
                    className="p-button-outlined p-button pirmary"
                  >
                    Streamer Dashboard
                  </Button>
                </Link>
              </div>
              <Divider align="center">
                <b>OR</b>
              </Divider>
              <div
                id="option-title"
              >
                <h4>
                  Start Watching
                </h4>
                <div className="p-inputgroup">
                  <InputText placeholder="Enter Channel Address" value={inputAddress} onChange={onInputChanged} />
                  <Button onClick={onNavigateClicked} label="Go!" />
                </div>
              </div>
            </div>
          )
      }
      <style jsx>
        {`
        .p-inputgroup {
          width: 24vw;
        }
        #button-row {
          display: flex;
          justifiy-content: center;
          gap: 4vw;
          margin-bottom: 5vh;
        }
        #address-container {
          margin-left: 2vw;
        }
        #options-header {
          display: flex;
        }
        #option-title {
          width: 11vw;
        }
        b {
          color: var(--text-color-secondary);
        }
        h4 {
          margin-top: 7.5vh;
          color: var(--text-color-primary);
          font-size: 3vh;
          line-height: 0;
        }
        #wallet-button-container {
          display: flex;
          justify-content: center;
          
        }
        #button-container {
          margin-top: 3vh;
          width: 25vw;
        }
      `}
      </style>
    </div>
  );
}
