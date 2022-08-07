import LitJsSdk from 'lit-js-sdk';
import Cookies from 'js-cookie';
import connectToLit from './index';
import getConditionsAndResource from './getConditionsAndResource';

export default async function checkIfSubscriber(channelAddress) {
  const { accessControlConditions, resourceIdSubscriber } = getConditionsAndResource({ role: 'subscriber', channelAddress });
  try {
    const client = await connectToLit();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'rinkeby' });
    let jwt;
    try {
      await client.saveSigningCondition({
        accessControlConditions, chain: 'rinkeby', authSig, resourceId: resourceIdSubscriber,
      });
      jwt = await client.getSignedToken({
        accessControlConditions, chain: 'rinkeby', authSig, resourceId: resourceIdSubscriber,
      });
    } catch (err) {
      console.log(err);
      jwt = await client.getSignedToken({
        accessControlConditions, chain: 'rinkeby', authSig, resourceId: resourceIdSubscriber,
      });
    }
    Cookies.set('lit-auth', jwt, { expires: 1 });
    return jwt;
  } catch (err) {
    Cookies.remove('lit-auth');
    console.log(err);
  }
}
