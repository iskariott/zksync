const { syncswap } = require('./modules/syncswap');
const { ZKSWAP, ZK_PROVIDER, SPACEFI } = require('./utils/constants');

const { swapExactETH, swapExactUSDC } = require('./modules/swapExact');
const { ethers } = require('ethers');

(async () => {
  const signer = new ethers.Wallet(
    '0f36a0a8bb7e7937b1af92d32c06e3a2d035df3e6fe79f5be869ab213e7c0b87',
    ZK_PROVIDER,
  );
  // await swapExactETH(signer, ZKSWAP, '0.00001'); // zkswap swap usdc
  // await swapExactUSDC(signer, ZKSWAP, '0.001'); // zkswap swap usdc
  // await swapExactETH(signer, SPACEFI, '0.00001'); // spacefi swap eth
  // await swapExactUSDC(signer, SPACEFI, '0.001'); // spacefi swap usdc
  // await syncswap(signer, 0.00001, true); // swap eth
  // await syncswap(signer, 0.00001, false); // swap usdc
})();
