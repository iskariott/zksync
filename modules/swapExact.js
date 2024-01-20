const { ethers } = require('ethers');
const { GAS_LIMIT } = require('../config.js');
const {
  MODULES,
  ZK_PROVIDER,
  ETH,
  USDC,
  SPACEFI_ABI,
  ZKSWAP_ABI,
} = require('../utils/constants.js');
const { c, findObjKeyByValue, logFile } = require('../utils/utils.js');
const { approveUSDC, getMinAmount } = require('./helpers.js');
const { parseUnits, formatUnits, parseEther, formatEther } = require('ethers/lib/utils.js');

async function swapExactUSDC(signer, router, amount) {
  const routerName = findObjKeyByValue(MODULES, router);
  const abi = routerName === MODULES.SPACEFI ? SPACEFI_ABI : ZKSWAP_ABI;
  try {
    const contract = new ethers.Contract(router, abi, signer);
    await approveUSDC(signer, router, amount);
    const receipt = await contract.swapExactTokensForETH(
      parseUnits(amount, 6),
      await getMinAmount(contract, amount, [USDC, ETH]),
      [USDC, ETH],
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        gasPrice: await ZK_PROVIDER.getGasPrice(),
        nonce: await ZK_PROVIDER.getTransactionCount(signer.address),
        // gasLimit: GAS_LIMIT,
      },
    );
    const { transactionHash } = await receipt.wait();
    console.log(`Swap ${amount}USDC # Module: ${routerName} # Hash: ${transactionHash}`);
    logFile(`Swap ${amount}USDC # Module: ${routerName} # Hash: ${transactionHash}`);
  } catch (e) {
    const code = e.code ? ` : ${e.code}` : '';
    console.log(c.red(`ERROR${code}! Swap ${amount}USDC # Module: ${routerName}`));
    logFile(`ERROR${code}! Swap ${amount}USDC # Module: ${routerName} `);
    throw e;
  }
}

async function swapExactETH(signer, router, amount) {
  const routerName = findObjKeyByValue(MODULES, router);
  const abi = routerName === MODULES.SPACEFI ? SPACEFI_ABI : ZKSWAP_ABI;

  try {
    const contract = new ethers.Contract(router, abi, signer);
    const receipt = await contract.swapExactETHForTokens(
      await getMinAmount(contract, amount, [ETH, USDC]),
      [ETH, USDC],
      signer.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        gasPrice: await ZK_PROVIDER.getGasPrice(),
        nonce: await ZK_PROVIDER.getTransactionCount(signer.address),
        // gasLimit: GAS_LIMIT,
        value: parseEther(amount),
      },
    );
    const { transactionHash } = await receipt.wait();
    console.log(`Swap ${amount}ETH # Module: ${routerName} # Hash: ${transactionHash}`);
    logFile(`Swap ${amount}ETH # Module: ${routerName} # Hash: ${transactionHash}`);
  } catch (e) {
    const code = e.code ? ` : ${e.code}` : '';
    console.log(c.red(`ERROR${code}! Swap ${amount}ETH # Module: ${routerName}`));
    logFile(`ERROR${code}! Swap ${amount}ETH # Module: ${routerName}`);
    throw e;
  }
}

module.exports = {
  swapExactETH,
  swapExactUSDC,
};
