import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function useProvider() {
  const [provider, setProvider] = useState();
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  }, []);
  return provider;
}
