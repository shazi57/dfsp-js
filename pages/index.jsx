import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import { ethers } from 'ethers';
import connectToLit from '../lit/index';
import Router, { useRouter } from 'next/router';

import useSigner from '../hooks/useSigner';
import checkIfAdmin from '../lit/checkIfAdmin';
import checkIfSubscriber from '../lit/checkIfSubscriber';
import SignInView from './components/elements/SignInView';
import SponsorList from './components/elements/SponsorList';

function Home() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [inputAddress, setInputAddress] = useState('');
  const { signer, signerAddr } = useSigner(provider);

  const onConnectButtonClicked = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    await connectToLit();
  };

  const onInputChanged = async (e) => {
    setInputAddress(e.target.value);
  };

  const onNavigateClicked = async () => {
    const jwt = await checkIfAdmin(inputAddress);
    if (!jwt) {
      await checkIfSubscriber(inputAddress);
    }
    router.push(`/channels/${inputAddress}?signer=${signerAddr}`);
  };

  const onSubscribedChannelsClicked = async () => {
    router.push(`/subscribed/${signerAddr}`);
  }

  return (
    <div id="app">
      <div id="text-logo">
        <h1>DFSP</h1>
        <h2>Decentralized</h2>
        <h2>Fan-based</h2>
        <h2>Streaming</h2>
        <h2>Platform</h2>
      </div>
      <Divider id="divider" layout="vertical" />
      <SignInView
        signerAddr={signerAddr}
        onConnectButtonClicked={onConnectButtonClicked}
        onNavigateClicked={onNavigateClicked}
        inputAddress={inputAddress}
        onInputChanged={onInputChanged}
        onSubscribedChannelsClicked={onSubscribedChannelsClicked}
      />
      <Divider id="divider" layout="vertical" />
      <SponsorList />
      <style jsx>
        {`
    #text-logo {
      width: 30vw;
      margin-left: 3vw;
    }
    h1 {
      font-size: 17vh;
      line-height: 0;
    }
    h2 {
      color: var(--text-color-secondary);
      font-size: 7vh;
      margin-left: 0.3vh;
      line-height: 0.15vh;
    }
    #app {
      background-color: var(--surface-card);
      display: flex;
      justify-content: center;
      gap: 2.5vw;
      margin-top: 22vh;
      width: 100vw;
      height: 50vh;
    }
  `}
      </style>
    </div>
  );
}

export default Home;
