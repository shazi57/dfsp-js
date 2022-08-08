import { Button } from 'primereact/button';
import { ethers } from 'ethers';
import timestamp from 'unix-timestamp';

export default function RightPanel(props) {
  const {
    streamData,
    role,
    onGoLiveStreamButtonClicked,
    onPurchaseClicked,
    publicSalePrice,
    publicSaleStart,
    publicSaleEnd,
    purchased,
    ticketId,
  } = props;

  const renderTopPanel = () => {
    if (role === 'admin') {
      const {
        streamKey,
        playbackId,
      } = streamData;
      return (
        <div id="stream-container">
          <div id="header">Stream</div>
          <div className="stream-entry" id="stream-id">
            <div id="stream-id-header">ID</div>
            <div id="stream-id-text">{streamKey}</div>
          </div>
          <div className="stream-entry" id="playback-id">
            <div id="stream-playback-header">PlaybackId</div>
            <div id="stream-playback-text">{playbackId}</div>
          </div>
          <Button id="stream-button" onClick={onGoLiveStreamButtonClicked} label="Go Live!" />
        </div>
      );
    }
    if (role === 'subscriber' || purchased) {
      return (
        <div id="stream-container">
          <div id="header">Stream</div>
          <div className="stream-entry" id="stream-id">
            <div id="stream-id-header">Ticket Id</div>
            <div id="stream-id-text">{ticketId}</div>
          </div>
          <Button id="stream-button" onClick={onGoLiveStreamButtonClicked} label="Watch Live!" />
        </div>
      );
    }
    if (role === 'guest') {
      return (
        <div id="stream-container">
          <div id="header">Buy NFT Pass to subscribe!</div>
          <div className="stream-entry" id="stream-id">
            <div id="stream-id-header">Price</div>
            <div id="stream-id-text">
              {ethers.utils.formatEther(publicSalePrice)}
              {' '}
              ETH
            </div>
          </div>
          <div className="stream-entry" id="playback-id">
            <div id="stream-playback-header">Sale Started</div>
            <div id="stream-playback-text">{timestamp.toDate(Number(publicSaleStart)).toLocaleDateString()}</div>
          </div>
          <div className="stream-entry" id="playback-id">
            <div id="stream-playback-header">Sale Ends</div>
            <div id="stream-playback-text">{timestamp.toDate(Number(publicSaleEnd)).toLocaleDateString() === 'Invalid Date' ? 'Forever' : timestamp.toDate(Number(publicSaleEnd)).toLocaleDateString()}</div>
          </div>
          <Button id="stream-button" onClick={onPurchaseClicked} label="Purhcase" />
        </div>
      );
    }
    return null;
  };

  return (
    <div id="right-panel">
      {renderTopPanel()}
    </div>
  );
}
