import Image from 'next/image';

import litLogo from 'public/lit-logo.png';
import livePeerLogo from 'public/livepeer.png';
import zoraLogo from 'public/Zora.png';

export default function SponsorList() {
  return (
    <div id="sponsor-container">
      <div id="sponsor-header">
        <ul id="sponsor-list">
          <h3>
            Sponsors
          </h3>
          <li>
            Access Control Powered By
            {' '}
            <b>Lit Protocol</b>
          </li>
          <li>
            Decentralized Live Streaming By
            {' '}
            <b>Livepeer</b>
          </li>
          <li>
            NFT creation and rendering By
            {' '}
            <b>Zora</b>
          </li>
        </ul>
        <div id="logo-container">
          <Image width={100} height={100} className="logo" src={litLogo} alt="lit-logo" />
          <Image width={100} height={100} className="logo" src={livePeerLogo} alt="lp-logo" />
          <Image width={100} height={100} className="logo" src={zoraLogo} alt="zora-logo" />
        </div>
      </div>
      <style jsx>
        {`
        #sponsor-container {
          margin-top: 2vh;
          width: 33vw;
        }
        #logo-container {
          margin-right: 4vw;
          display: flex;
          justify-content: center;
          gap: 2vw;
        }
        li {
          font-size: 3vh;
        }
        ul {
          margin-bottom: 7vh;
        }
        h3 {
          color: var(--text-color-secondary);
          font-size: 4vh;
        }
        `}
      </style>
    </div>
  );
}
