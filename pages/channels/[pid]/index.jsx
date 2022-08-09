import Cookies from 'cookies';
import LitJsSdk from 'lit-js-sdk';
// import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useState } from 'react';
import { createClient } from 'urql';
import axios from 'axios';
import abi from 'pages/artifacts/ERC721Drop.json';
import JSONdb from 'simple-json-db';

import useProvider from 'hooks/useProvider';
// import checkIfAdmin from 'lit/checkIfAdmin';
import useSigner from 'hooks/useSigner';
// import checkIfSubscriber from 'lit/checkIfSubscriber';
import HeroImage from 'pages/components/elements/HeroImage';
import LeftPanel from 'pages/components/elements/LeftPanel';
import RightPanel from '../../components/elements/RightPanel';

export default function Dashboard(props) {
  const router = useRouter();
  const [purchased, setPurchased] = useState(false);
  const [ticketId, setTicketId] = useState();
  const provider = useProvider();
  const { signer } = useSigner(provider);
  const {
    role, streamData, data: {
      erc721Drop: {
        name,
        symbol,
        address,
        owner,
        maxSupply,
        editionMetadata: {
          description,
          imageURI,
        },
        salesConfig: {
          publicSalePrice,
          publicSaleStart,
          publicSaleEnd,
        },
      },
    },
  } = props;
  // const onCreateStreamButtonClicked = async () => {
  //   const channelAddress = router.query.pid;
  //   await checkIfAdmin(channelAddress);
  //   await checkIfSubscriber(channelAddress);
  //   router.push(`/channels/${channelAddress}/stream`);
  // };
  const onGoLiveStreamButtonClicked = async () => {
    const channelAddress = router.query.pid;
    // const streamId = streamData.streamKey;
    const { playbackId } = streamData;
    router.push(`/channels/${channelAddress}/stream/${playbackId}`);
  };

  const onPurchaseClicked = async () => {
    const proxyAddr = router.query.pid;
    const implementationContract = new ethers.Contract('0xD1e304157bc63A3A96Fa7441f2b1A7091F1498A6', abi);
    const proxyConnected = implementationContract.attach(proxyAddr);
    const signerConnected = proxyConnected.connect(signer);
    const purchaseTX = await signerConnected.purchase(1, { value: ethers.BigNumber.from(publicSalePrice) });
    try {
      const txReceipt = await purchaseTX.wait();
      setPurchased(true);
      const event = txReceipt.events.find(({ event }) => (event === 'CreatedDrop'));
      setTicketId(event.args[3]);
    } catch (err) {
      setPurchased(false);
    }
  };

  return (
    <div>
      <HeroImage imageURL={imageURI} />
      {/* <Link
        href={`/channels/${router.query.pid}/stream`}
      >
      </Link> */}
      {/* <Button onClick={onCreateStreamButtonClicked} /> */}
      <div id="grid-container">
        <div id="left-grid">
          <LeftPanel
            name={name}
            symbol={symbol}
            address={address}
            owner={owner}
            description={description}
            maxSupply={maxSupply}
          />
        </div>
        <div id="right-grid">
          <RightPanel
            role={role}
            purchased={purchased}
            streamData={streamData}
            publicSalePrice={publicSalePrice}
            publicSaleStart={publicSaleStart}
            publicSaleEnd={publicSaleEnd}
            onGoLiveStreamButtonClicked={onGoLiveStreamButtonClicked}
            onPurchaseClicked={onPurchaseClicked}
            ticketId={ticketId}
          />
        </div>
      </div>
      <style jsx>
        {`
          #left-grid {
            min-width: 0;
          }
          #grid-container {
            margin: auto;
            grid-template-columns: 6fr 4fr;
            min-width: 0;
            max-width: 55vw;
            margin-top: 5vh;          
            margin-bottom: 20vh;  
            column-gap: 2vw;
            display: grid;
          }

          #right-grid {
            height: min-content;
            padding: 1vw;
            background-color: var(--surface-card);
            border-radius: var(--border-radius);
          }
        `}
      </style>
    </div>
  );
}

export async function getServerSideProps({
  req, res, params,
}) {
  // const db = new JSONdb('db/storage.json');
  const livePeerAPI = axios.create({
    baseURL: 'https://livepeer.studio',
    headers: {
      Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
    },
  });

  // fetch prop data from subgraph
  const APIURL = 'https://api.thegraph.com/subgraphs/name/iainnash/erc721droprinkeby';
  const tokensQuery = `
  query {
    erc721Drop(id: "${params.pid}"){
      name,
      symbol,
      network,
      address,
      owner,
      maxSupply,
      totalMinted,
      editionMetadata{
        description,
        imageURI
      },
      salesConfig{
        publicSalePrice,
        maxSalePurchasePerAddress,
        publicSaleStart,
        publicSaleEnd
      }
    }
  }
  `;

  const client = createClient({
    url: APIURL,
  });

  const { data } = await client.query(tokensQuery).toPromise();
  // let streamData = db.get(params.pid);
  // if (!streamData) {
  //   const response = await livePeerAPI.post('/api/stream', {
  //     name: data.erc721Drop.name,
  //   });

  //   streamData = response.data;
  //   db.set(params.pid, streamData);
  // }
  const response = await livePeerAPI.post('/api/stream', {
    name: data.erc721Drop.name,
  });

  const streamData = response.data;
  const cookies = new Cookies(req, res);
  const jwt = cookies.get('lit-auth');

  let role;
  if (!jwt) {
    role = 'guest';
  } else {
    const { payload } = LitJsSdk.verifyJwt({ jwt });
    role = payload.role;
    // console.log(payload);
    if (payload.baseUrl !== process.env.NEXT_PUBLIC_BASE_URL || (payload.path !== `channels/${params.pid}` && payload.path !== `/channels/${params.pid}`)) {
      // console.log(payload.baseUrl !== process.env.NEXT_PUBLIC_BASE_URL);
      // console.log(params.pid);
      // console.log(payload.path !== `/channels/${params.pid}`);
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  }

  return {
    props: {
      role,
      streamData: streamData || null,
      data,
    },
  };
}
