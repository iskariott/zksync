const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Providers
const ETH_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth');
// const ZK_PROVIDER = new ethers.providers.JsonRpcProvider('https://zksync2-mainnet.zksync.io');
const ZK_PROVIDER = new ethers.providers.JsonRpcProvider('https://zksync.meowrpc.com');
// const ZK_PROVIDER = new ethers.providers.JsonRpcProvider(
//   'https://zksync-era.blockpi.network/v1/rpc/public',
// );

// ABIs
const ERC20_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/erc20.abi.json')));
const WETH_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/weth.abi.json')));
const DMAIL_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/dmail.abi.json')));
const SWAPEXACT_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/swapExact.abi.json')),
);
const SYNCSWAP_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/syncswap/syncswap.abi.json')),
);
const SYNCSWAP_CL_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/syncswap/classic_pool.json')),
);
const SYNCSWAP_CL_DATA_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/syncswap/classic_pool_data.json')),
);

// Contracts
const USDC = '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4';
const ETH = '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91';
const ZKSWAP = '0x18381c0f738146Fb694DE18D1106BdE2BE040Fa4';
const SYNCSWAP = '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295';
const SYNCSWAP_POOL = '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb';
const SPACEFI = '0xbE7D1FD1f6748bbDefC4fbaCafBb11C6Fc506d1d';
const DMAIL = '0x981F198286E40F9979274E0876636E9144B8FB8E';

const MODULES = {
  ZKSWAP,
  SYNCSWAP,
  SPACEFI,
  DMAIL,
};

module.exports = {
  MODULES,
  ETH_PROVIDER,
  ZK_PROVIDER,
  ERC20_ABI,
  WETH_ABI,
  DMAIL_ABI,
  SWAPEXACT_ABI,
  SYNCSWAP_ABI,
  SYNCSWAP_CL_ABI,
  SYNCSWAP_CL_DATA_ABI,
  USDC,
  ETH,
  ZKSWAP,
  SYNCSWAP,
  SYNCSWAP_POOL,
  SPACEFI,
  DMAIL,
};
