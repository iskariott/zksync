const { ZKSWAP, SPACEFI } = require('../utils/constants.js');
const { swapExactUSDC, swapExactETH } = require('./swapExact.js');
const { syncswap } = require('./syncswap.js');

function getUsdcModule(signer, amount) {
  const swap1 = () => swapExactUSDC(signer, ZKSWAP, amount);
  const swap2 = () => swapExactUSDC(signer, SPACEFI, amount);
  const swap3 = () => syncswap(signer, amount, false);
  const modules = [swap1, swap2, swap3];
  return modules[Math.floor(Math.random() * modules.length)];
}

function getEthModule(signer, amount) {
  const swap1 = () => swapExactETH(signer, ZKSWAP, amount);
  const swap2 = () => swapExactETH(signer, SPACEFI, amount);
  const swap3 = () => syncswap(signer, amount, true);
  const modules = [swap1, swap2, swap3];
  return modules[Math.floor(Math.random() * modules.length)];
}

module.exports = {
  getUsdcModule,
  getEthModule,
};
