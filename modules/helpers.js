const { c, parseValue, findObjKeyByValue, logFile } = require('../utils/utils.js');
const readline = require('readline');
const { CHECK_GAS_DELAY, ALLOWED_GWEI, APPROVE_AMOUNT, GAS_LIMIT } = require('../config.js');
const {
  MODULES,
  ETH_PROVIDER,
  USDC,
  ERC20_ABI,
  ZK_PROVIDER,
  ETH,
} = require('../utils/constants.js');
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
  const approveAmount = Math.random() * (APPROVE_AMOUNT[1] - APPROVE_AMOUNT[0]) + APPROVE_AMOUNT[0];
  try {
    const contract = new ethers.Contract(USDC, ERC20_ABI, signer);
    const allowanceData = await contract.allowance(signer.address, router);
    const allowance = parseValue(allowanceData, 6);

    if (amount > allowance) {
      const approve = await contract.approve(
        router,
        ethers.utils.parseUnits(approveAmount.toFixed(6), 6),
        {
          gasPrice: await ZK_PROVIDER.getGasPrice(),
          gasLimit: GAS_LIMIT,
        },
      );
      const { transactionHash } = await approve.wait();
      const log = `Approved ${approveAmount}USDC # Module: ${routerName} # Hash: ${transactionHash}`;
      console.log(log);
      logFile(log);
    }
  } catch (e) {
    const code = e.code ? ` : ${e.code}` : '';
    console.log(c.red(`ERROR${code}! Approve: ${approveAmount}USDC # Module: ${routerName}`));
    logFile(`ERROR${code}! Approve: ${approveAmount}USDC # Module: ${routerName}`);
    throw e;
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

async function getMinAmount(contract, amount, path) {
  const decimals = path[0] === ETH ? [18, 6] : [6, 18];
  const bgAmount = ethers.utils.parseUnits(amount, decimals[0]);
  const bgMinAmount = await contract.getAmountsOut(bgAmount, path);
  const minAmount = ethers.utils.formatUnits(bgMinAmount[1], decimals[1]);
  const minAmountSlip = minAmount - (minAmount / 100) * 0.5;
  return ethers.utils.parseUnits(minAmountSlip.toFixed(6), decimals[1]);
}

module.exports = {
  waitForGas,
  getTokenBalance,
  approveUSDC,
  getMinAmount,
};
