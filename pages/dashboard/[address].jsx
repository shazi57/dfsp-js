import { createClient } from 'urql';
import Channel from '../components/elements/Channel';

export default function Channels(props) {
  const { data: { erc721Drops } } = props;
  return (
    <div id="channels-container">
      <div id="header-wrapper">
        <h3 id="header">
          My Channels
        </h3>
      </div>
      {erc721Drops.map((channel) => (
        <Channel
          key={channel.address}
          name={channel.name}
          address={channel.address}
          imageURI={channel.editionMetadata.imageURI}
          description={channel.editionMetadata.description}
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
    erc721Drops(where: {
      owner: "${params.address}"
    }) {
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
`;

  const client = createClient({
    url: APIURL,
  });

  const { data } = await client.query(tokensQuery).toPromise();
  return {
    props: {
      data,
    },
  };
}
