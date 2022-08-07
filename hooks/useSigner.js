import { useState, useEffect } from 'react';

export default function useSigner(provider) {
  const [signer, setSigner] = useState(null);
  const [signerAddr, setSignerAddr] = useState('');

  const handleAccountsChanged = async () => {
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const signerAddr = await signer.getAddress();
    setSigner(signer);
    setSignerAddr(signerAddr);
  };
  useEffect(() => {
    if (provider) {
      handleAccountsChanged();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [provider]);

  return { signer, signerAddr };
}
