import deployment from 'contracts/ABI.json';

const buildNetworkConfig = (contractsDeployment, base) => {
  const { address: tokenContractAddress, abi: tokenContractAbi } = contractsDeployment;

  return {
    ...base,
    tokenContractAddress,
    tokenContractAbi
  };
};

const NETWORKS = [
  buildNetworkConfig(deployment, {
    id: 50,
    name: 'XDC Mainnet',
    rpcUrl: 'https://rpc.xinfin.yodaplus.net',
    deploymentUrl: 'https://goadmin.yodaplus.net/'
  }),
  buildNetworkConfig(deployment, {
    id: 51,
    name: 'XDC Apothem Testnet',
    rpcUrl: 'https://rpc-apothem.xinfin.yodaplus.net',
    deploymentUrl: 'https://goadmin.yodaplus.net/'
  })
];

export default NETWORKS;
