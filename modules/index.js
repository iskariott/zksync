const { ZKSWAP, SPACEFI } = require('../utils/constants.js');
const { swapExactUSDC, swapExactETH } = require('./swapExact.js');
const { syncswap } = require('./syncswap.js');

function getUsdcModules(signer, amount) {
  const swap1 = () => swapExactUSDC(signer, ZKSWAP, amount);
  const swap2 = () => swapExactUSDC(signer, SPACEFI, amount);
  const swap3 = () => syncswap(signer, amount, false);
  return [swap1, swap2, swap3];
}

function getEthModules(signer, amount) {
  const swap1 = () => swapExactETH(signer, ZKSWAP, amount);
  const swap2 = () => swapExactETH(signer, SPACEFI, amount);
  const swap3 = () => syncswap(signer, amount, true);
  return [swap1, swap2, swap3];
}

module.exports = {
  getUsdcModules,
  getEthModules,
};
