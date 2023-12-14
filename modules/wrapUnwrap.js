const { ethers } = require('ethers');
const { GAS_LIMIT } = require('../config.js');
const { ETH, WETH_ABI, ZK_PROVIDER } = require('../utils/constants.js');
const { c, logFile } = require('../utils/utils.js');

async function wrapEth(signer, amount) {
  try {
    const contract = new ethers.Contract(ETH, WETH_ABI, signer);
    const receipt = await contract.deposit({
      value: ethers.utils.parseEther(amount.toFixed(6)),
      gasPrice: await ZK_PROVIDER.getGasPrice(),
      nonce: await ZK_PROVIDER.getTransactionCount(signer.address),
      gasLimit: GAS_LIMIT,
    });
    const { transactionHash } = await receipt.wait();
    console.log(`Wrapped ${amount}ETH # hash: ${transactionHash}`);
    logFile(`Wrapped ${amount}ETH # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! Wrap ${amount}ETH`));
    logFile(`ERROR! Wrap ${amount}ETH`);
    throw error;
  }
}

async function unwrapEth(signer, amount) {
  try {
    const contract = new ethers.Contract(ETH, WETH_ABI, signer);
    const receipt = await contract.withdraw(ethers.utils.parseEther(amount.toFixed(6)), {
      gasPrice: await ZK_PROVIDER.getGasPrice(),
      nonce: await ZK_PROVIDER.getTransactionCount(signer.address),
      gasLimit: GAS_LIMIT,
    });
    const { transactionHash } = await receipt.wait();
    console.log(`Unwrapped ${amount}WETH # hash: ${transactionHash}`);
    logFile(`Unwrapped ${amount}WETH # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! Unwrap ${amount}WETH`));
    logFile(`ERROR! Unwrap ${amount}WETH`);
    throw error;
  }
}

module.exports = {
  wrapEth,
  unwrapEth,
};
