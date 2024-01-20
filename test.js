const { syncswap } = require('./modules/syncswap.js');
const {
  ZKSWAP,
  ZK_PROVIDER,
  SPACEFI,
  SPACEFI_ABI,
  ZKSWAP_ABI,
  SYNCSWAP,
  SYNCSWAP_ABI,
} = require('./utils/constants.js');
const { swapExactETH, swapExactUSDC } = require('./modules/swapExact.js');
const { ethers } = require('ethers');

(async () => {
  const signer = new ethers.Wallet('private key', ZK_PROVIDER);
  // const c = new ethers.Contract(SPACEFI, SPACEFI_ABI, signer);
  // const c = new ethers.Contract(ZKSWAP, ZKSWAP_ABI, signer);
  // const c = new ethers.Contract(SYNCSWAP, SYNCSWAP_ABI, signer);
  // await swapExactETH(signer, ZKSWAP, '0.00001'); // zkswap swap eth -> usdc
  // await swapExactUSDC(signer, ZKSWAP, '0.001'); // zkswap swap usdc -> eth
  // await swapExactETH(signer, SPACEFI, '0.00001'); // spacefi swap eth -> usdc
  // await swapExactUSDC(signer, SPACEFI, '0.001'); // spacefi swap usdc -> eth
  // await syncswap(signer, 0.00001, true); // swap eth -> usdc
  // await syncswap(signer, 0.00001, false); // swap usdc -> eth
})();
