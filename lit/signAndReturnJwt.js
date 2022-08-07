import LitJsSdk from 'lit-js-sdk';
import Cookies from 'js-cookie';
import connectToLit from './index';
import getConditionsAndResource from './getConditionsAndResource';

export default async function signAndReturnJwt(channelAddress) {
  const { evmContractConditions, resourceIdAdmin } = getConditionsAndResource({ role: 'admin', channelAddress });

  const { accessControlConditions, resourceIdSubscriber } = getConditionsAndResource({ role: 'subscriber', channelAddress });

  const client = await connectToLit();

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'rinkeby' });

  await client.saveSigningCondition({
    evmContractConditions, chain: 'rinkeby', authSig, resourceId: resourceIdAdmin,
  });

  await client.saveSigningCondition({
    accessControlConditions, chain: 'rinkeby', authSig, resourceId: resourceIdSubscriber,
  });

  try {
    const jwt = await client.getSignedToken({
      evmContractConditions, chain: 'rinkeby', authSig, resourceId: resourceIdAdmin,
    });
    Cookies.set('lit-auth', jwt, { expires: 1 });
  } catch (err) {
    Cookies.remove('lit-auth');
    console.log('error: ', err);
  }
}
