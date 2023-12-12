const { c, parseValue, findObjKeyByValue, logFile } = require('../utils/utils.js');
const readline = require('readline');
const { CHECK_GAS_DELAY, ALLOWED_GWEI, APPROVE_AMOUNT, GAS_LIMIT } = require('../config.js');
const { MODULES, ETH_PROVIDER, USDC, ERC20_ABI, ZK_PROVIDER } = require('../utils/constants.js');
const { ethers } = require('ethers');

async function getTokenBalance(signer, address) {
  try {
    const c = new ethers.Contract(address, ERC20_ABI, signer);
    return await c.balanceOf(signer.address);
  } catch (error) {
    console.log(c.red('ERROR getTokenBalance'));
    throw error;
  }
}

async function approveUSDC(signer, router, amount) {
  const routerName = findObjKeyByValue(MODULES, router);
  try {
    const contract = new ethers.Contract(USDC, ERC20_ABI, signer);
    const allowanceData = await contract.allowance(signer.address, router);
    const allowance = parseValue(allowanceData, 6);

    if (amount > allowance) {
      const approve = await contract.approve(
        router,
        ethers.utils.parseUnits(APPROVE_AMOUNT.toString(), 6),
        {
          gasPrice: await ZK_PROVIDER.getGasPrice(),
          gasLimit: GAS_LIMIT,
        },
      );
      const { transactionHash } = await approve.wait();
      console.log(
        `Approved ${APPROVE_AMOUNT}USDC # module: ${routerName} # hash: ${transactionHash}`,
      );
      logFile(`Approved ${APPROVE_AMOUNT}USDC # module: ${routerName} # hash: ${transactionHash}`);
    }
  } catch (error) {
    console.log(c.red(`ERROR approve: ${APPROVE_AMOUNT}USDC # module: ${routerName}`));
    logFile(`ERROR approve: ${APPROVE_AMOUNT}USDC # module: ${routerName}`);
    throw error;
  }
}

async function waitForGas() {
  const gwei = parseValue(await ETH_PROVIDER.getGasPrice(), 9);
  if (gwei <= ALLOWED_GWEI) return;
  console.log(`${c.red('Waiting for gas...')}`);
  const updateLine = (content) => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(content);
  };
  updateLine(`${c.grn('GWEI')} ${c.yel(gwei.toFixed(2))}`);
  return new Promise((r) => {
    let timer = setInterval(async () => {
      const gwei = parseValue(await ETH_PROVIDER.getGasPrice(), 9);
      updateLine(`${c.grn('GWEI')} ${c.yel(gwei.toFixed(2))}`);
      if (gwei <= ALLOWED_GWEI) {
        clearInterval(timer);
        r();
      }
    }, CHECK_GAS_DELAY * 1000);
  });
}

module.exports = {
  waitForGas,
  getTokenBalance,
  approveUSDC,
};
