const { ethers } = require('ethers');
const { GAS_LIMIT } = require('../config.js');
const { ETH, WETH_ABI, ZK_PROVIDER } = require('../utils/constants.js');
const { c } = require('../utils/utils.js');

async function wrapEth(signer, amount) {
  try {
    const contract = new ethers.Contract(ETH, WETH_ABI, signer);
    const receipt = await contract.deposit({
      value: ethers.utils.parseEther(amount.toFixed(6)),
      gasPrice: await ZK_PROVIDER.getGasPrice(),
      gasLimit: GAS_LIMIT,
    });
    const { transactionHash } = await receipt.wait();
    console.log(`Wrapped ${amount}ETH # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! wrapEth ${amount}ETH`));
    throw error;
  }
}

async function unwrapEth(signer, amount) {
  try {
    const contract = new ethers.Contract(ETH, WETH_ABI, signer);
    const receipt = await contract.withdraw(ethers.utils.parseEther(amount.toFixed(6)), {
      gasPrice: await ZK_PROVIDER.getGasPrice(),
      gasLimit: GAS_LIMIT,
    });
    const { transactionHash } = await receipt.wait();
    console.log(`Unwrapped ${amount}ETH # hash: ${transactionHash}`);
  } catch (error) {
    console.log(c.red(`ERROR! unwrapEth ${amount}ETH`));
    throw error;
  }
}

module.exports = {
  wrapEth,
  unwrapEth,
};
