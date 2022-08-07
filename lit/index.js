import LitJsSdk from 'lit-js-sdk';

export default async function connectToLit() {
  let client;
  if (!window.litNodeClient) {
    client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
    await client.connect();
    document.addEventListener('lit-ready', () => {
      console.log('LIT network is ready');
    }, false);
  } else {
    client = window.litNodeClient;
  }
  return client;
}
