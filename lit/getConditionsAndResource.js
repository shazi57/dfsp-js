export default function getConditions({ role, channelAddress }) {
  if (role === 'admin') {
    return {
      evmContractConditions: [{
        contractAddress: channelAddress,
        functionName: 'isAdmin',
        functionParams: [':userAddress'],
        functionAbi: {
          inputs: [
            {
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
          ],
          name: 'isAdmin',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        chain: 'rinkeby',
        returnValueTest: {
          key: '',
          comparator: '=',
          value: 'true',
        },
      }],
      resourceIdAdmin: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        path: `/channels/${channelAddress}`,
        orgId: '',
        role,
        extraData: 'v5',
      },
    };
  }
  return {
    accessControlConditions: [{
      contractAddress: channelAddress,
      standardContractType: 'ERC721',
      chain: 'rinkeby',
      method: 'balanceOf',
      parameters: [
        ':userAddress',
      ],
      returnValueTest: {
        comparator: '>',
        value: '0',
      },
    }],
    resourceIdSubscriber: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      path: `channels/${channelAddress}`,
      orgId: '',
      role,
      extraData: 'v5',
    },
  };
}
