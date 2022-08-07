import LitJsSdk from 'lit-js-sdk';
import Cookies from 'js-cookie';
import connectToLit from './index';
import getConditionsAndResource from './getConditionsAndResource';

export default async function checkIfAdmin(channelAddress) {
  const { evmContractConditions, resourceIdAdmin } = getConditionsAndResource({ role: 'admin', channelAddress });
  try {
    const client = await connectToLit();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'rinkeby' });
    let jwt;
    try {
      await client.saveSigningCondition({
        evmContractConditions, chain: 'rinkeby', authSig, resourceId: resourceIdAdmin,
      });
      jwt = await client.getSignedToken({
        evmContractConditions, chain: 'rinkeby', authSig, resourceId: resourceIdAdmin,
      });
    } catch (err) {
      console.log(err);
      jwt = await client.getSignedToken({
        evmContractConditions, chain: 'rinkeby', authSig, resourceId: resourceIdAdmin,
      });
    }
    console.log(jwt);
    Cookies.set('lit-auth', jwt, { expires: 1 });
  } catch (err) {
    Cookies.remove('lit-auth');
    console.log(err);
  }
}
