import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

export default function LeftPanel(props) {
  const {
    name,
    symbol,
    address,
    owner,
    description,
    maxSupply,
  } = props;
  return (
    <div id="left-panel">
      <div id="channel-name">{name}</div>
      <div id="channel-symbol-size">
        <Tag value={symbol} />
        <div id="edition-size">
          Max Fans
          {' '}
          {maxSupply}
        </div>
      </div>
      <div id="channel-description">{description}</div>
      <div id="owner-title">Streamer</div>
      <div id="owner">
        <i className="pi pi-star-fill" />
        <div id="owner-address">
          {owner}
        </div>
      </div>
      <Divider />
      <style jsx>
        {`
          #owner {
            display: flex;
            gap: 0.3vw;
          }
          #left-panel {
            display: flex;
            flex-direction: column;
            gap: 1vh;
          }
          #channel-symbol-size {
            margin-top: 1vh;
            display: flex;
            gap: 1vw;
          }
          #channel-name {
            color: var(--text-color);
            font-size: 2.5vw;
          }
          #edition-size {
            margin-top: 0.3vh;
            color: var(--text-color-secondary);
          }
          #channel-description {
            margin-top : 3vh;
          }
          #owner-address{
            color: var(--text-color-secondary);
          }
          #owner-title {
            margin-top: 5vh;
          }
        `}
      </style>
    </div>
  );
}
