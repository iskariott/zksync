const { ethers } = require('ethers');
const { DELAY_ACC, ACCS, SWAP_TYPE, AMOUNT_OUT_PERCENT } = require('./config.js');
const { waitForGas, getTokenBalance } = require('./modules/helpers.js');
const { getUsdcModules, getEthModules } = require('./modules/index.js');
const { unwrapEth, wrapEth } = require('./modules/wrapUnwrap.js');
const { ETH, ZK_PROVIDER, USDC } = require('./utils/constants.js');
const { parseValue, cliCountDown, readWallets, c, logFile } = require('./utils/utils.js');

async function process() {
  const keys = readWallets();
  if (ACCS[1] >= keys.length)
    throw new Error(
      `${c.red('The number of accounts is greater than in the')} ${c.blu('wallets.txt')}${c.red(
        '. Please change',
      )} ${c.yel('ACCS')} ${c.red('in the')} ${c.blu('config.js')} `,
    );
  for (let i = ACCS[0]; i <= ACCS[1]; i++) {
    logFile(`Account: ${i}`);
    console.log(
      '======================================================================================================================',
    );
    console.log('Account: ', i);
    console.log(
      '----------------------------------------------------------------------------------------------------------------------',
    );
    try {
      const signer = new ethers.Wallet(keys[i], ZK_PROVIDER);
      if (!SWAP_TYPE) {
        const usdc_balance = parseValue(await getTokenBalance(signer, USDC), 6).toFixed(6);
        if (Number(usdc_balance)) {
          const modules = getUsdcModules(signer, usdc_balance);
          await waitForGas();
          await modules[Math.floor(Math.random() * modules.length)]();
        } else {
          const eth_balance = parseValue(await signer.getBalance(), 18);
          const amount = (eth_balance * (AMOUNT_OUT_PERCENT / 100)).toFixed(6);
          const modules = getEthModules(signer, amount);
          await waitForGas();
          await modules[Math.floor(Math.random() * modules.length)]();
        }
      } else {
        const weth_balance = parseValue(await getTokenBalance(signer, ETH), 18).toFixed(6);
        if (Number(weth_balance)) {
          await waitForGas();
          await unwrapEth(signer, weth_balance);
        } else {
          const eth_balance = parseValue(await signer.getBalance(), 18);
          const amount = (eth_balance * (AMOUNT_OUT_PERCENT / 100)).toFixed(6);
          await waitForGas();
          await wrapEth(signer, amount);
        }
      }
      console.log(
        '======================================================================================================================',
      );
      logFile(
        '======================================================================================================================',
        false,
      );
      await cliCountDown(
        Math.floor(Math.random() * (DELAY_ACC[1] - DELAY_ACC[0] + 1)) + DELAY_ACC[0],
      );
    } catch (error) {
      console.log(error);
    }
  }
}

process();
