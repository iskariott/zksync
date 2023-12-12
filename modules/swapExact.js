const { ethers } = require('ethers');
const { GAS_LIMIT } = require('../config.js');
const { MODULES, SWAPEXACT_ABI, ZK_PROVIDER, ETH, USDC } = require('../utils/constants.js');
const { c, findObjKeyByValue, logFile } = require('../utils/utils.js');
const { approveUSDC } = require('./helpers.js');

async function swapExactUSDC(signer, router, amount) {
  const routerName = findObjKeyByValue(MODULES, router);
  try {
    const contract = new ethers.Contract(router, SWAPEXACT_ABI, signer);
    await approveUSDC(signer, router, amount);
    const receipt = await contract.swapExactTokensForETH(
      ethers.utils.parseUnits(amount, 6),
      0,
      [USDC, ETH],
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        gasPrice: await ZK_PROVIDER.getGasPrice(),
        gasLimit: GAS_LIMIT,
      },
    );
    const { transactionHash } = await receipt.wait();
    console.log(`Swap ${amount}USDC # module: ${routerName} # hash: ${transactionHash}`);
    logFile(`Swap ${amount}USDC # module: ${routerName} # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! Swap ${amount}USDC # module: ${routerName}`));
    logFile(`ERROR! Swap ${amount}USDC # module: ${routerName}`);
    throw error;
  }
}

async function swapExactETH(signer, router, amount) {
  const routerName = findObjKeyByValue(MODULES, router);
  try {
    const contract = new ethers.Contract(router, SWAPEXACT_ABI, signer);
    const receipt = await contract.swapExactETHForTokens(
      0,
      [ETH, USDC],
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        gasPrice: await ZK_PROVIDER.getGasPrice(),
        gasLimit: GAS_LIMIT,
        value: ethers.utils.parseEther(amount),
      },
    );
    const { transactionHash } = await receipt.wait();
    console.log(`Swap ${amount}ETH # module: ${routerName} # hash: ${transactionHash}`);
    logFile(`Swap ${amount}ETH # module: ${routerName} # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! Swap ${amount}ETH # module: ${routerName}`));
    logFile(`ERROR! Swap ${amount}ETH # module: ${routerName}`);
    throw error;
  }
}

module.exports = {
  swapExactETH,
  swapExactUSDC,
};
