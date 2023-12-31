const { ethers } = require('ethers');
const { GAS_LIMIT } = require('../config.js');
const {
  SYNCSWAP_CL_ABI,
  SYNCSWAP_POOL,
  SYNCSWAP_ABI,
  SYNCSWAP,
  ZK_PROVIDER,
  ETH,
  USDC,
} = require('../utils/constants.js');
const { c, logFile } = require('../utils/utils.js');
const { approveUSDC } = require('./helpers.js');

async function syncswap(signer, amount, isEthSwap) {
  let tokens;
  let parsedAmount;
  try {
    if (isEthSwap) {
      tokens = [ETH, USDC];
      parsedAmount = ethers.utils.parseEther(amount);
    } else {
      tokens = [USDC, ETH];
      await approveUSDC(signer, SYNCSWAP, amount);
      parsedAmount = ethers.utils.parseUnits(amount, 6);
    }
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const cl_pool_contract = new ethers.Contract(SYNCSWAP_POOL, SYNCSWAP_CL_ABI, ZK_PROVIDER);
    const poolAddress = await cl_pool_contract.getPool(tokens[0], tokens[1]);
    const swapData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint8'],
      [tokens[0], signer.address, 1], // tokenIn, to, withdraw mode
    );
    const steps = [
      {
        pool: poolAddress,
        data: swapData,
        callback: ZERO_ADDRESS,
        callbackData: '0x',
      },
    ];

    const paths = [
      {
        steps: steps,
        tokenIn: isEthSwap ? ZERO_ADDRESS : USDC,
        amountIn: parsedAmount,
      },
    ];

    const router = new ethers.Contract(SYNCSWAP, SYNCSWAP_ABI, signer);

    const receipt = await router.swap(
      paths,
      0,
      ethers.BigNumber.from(Math.floor(Date.now() / 1000)).add(1800),
      {
        value: parsedAmount,
        gasLimit: GAS_LIMIT,
        nonce: await ZK_PROVIDER.getTransactionCount(signer.address),
        gasPrice: await ZK_PROVIDER.getGasPrice(),
      },
    );
    const { transactionHash } = await receipt.wait();
    console.log(
      `Swap ${amount}${isEthSwap ? 'ETH' : 'USDC'} # Module: SyncSwap # hash: ${transactionHash}`,
    );
    logFile(
      `Swap ${amount}${isEthSwap ? 'ETH' : 'USDC'} # Module: SyncSwap # hash: ${transactionHash}`,
    );
  } catch (e) {
    const code = e.code ? ` : ${e.code}` : '';
    console.log(
      c.red(`ERROR${code}! Swap ${amount}${isEthSwap ? 'ETH' : 'USDC'} # Module: SyncSwap`),
    );
    logFile(`ERROR${code}! Swap ${amount}${isEthSwap ? 'ETH' : 'USDC'} # Module: SyncSwap`);
    throw e;
  }
}

module.exports = {
  syncswap,
};
