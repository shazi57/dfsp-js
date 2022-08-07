import { createClient } from 'urql';
import Channel from '../components/elements/Channel';

export default function Channels(props) {
  const { data: { nfteditionTransfers } } = props;
  return (
    <div id="channels-container">
      <div id="header-wrapper">
        <h3 id="header">
          My Subscribed Channels
        </h3>
      </div>
      {nfteditionTransfers.map(({ drop }) => (
        <Channel
          key={drop.address}
          name={drop.name}
          tokenId={drop.tokenId}
          address={drop.address}
          imageURI={drop.editionMetadata.imageURI}
          description={drop.editionMetadata.description}
        />
      ))}
      <style jsx>
        {`
          #channels-container {
            display: flex;
            flex-direction: column;
            border-radius: var(--border-radius);
            width: 40vw;
            min-height: 80vh;
            gap: 2vh;
            margin-top : 5vh;
            margin-bottom: 5vh;
            margin-left: auto;
            margin-right: auto;
            background-color: var(--surface-card);
            padding-top: 3vh;
            padding-left: 3vw;
            padding-right: 3vw;
            padding-bottom: 3vh;
          }
          #header-wrapper {
            margin-left: auto;
            margin-right: auto;
          }
        `}
      </style>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const APIURL = 'https://api.thegraph.com/subgraphs/name/iainnash/erc721droprinkeby';
  const tokensQuery = `
  query {
    nfteditionTransfers(where: {
      to: "${params.address}"
    }) {
    drop {
      name
      owner
      creator
      address
      editionMetadata {
        imageURI
        description
      }
    }
  }
}`;

  const client = createClient({
    url: APIURL,
  });

  const { data } = await client.query(tokensQuery).toPromise();
  console.log(data);
  return {
    props: {
      data,
    },
  };
}
