const { ethers } = require('ethers');
const { DELAY_ACC, SWAP_TYPE, AMOUNT_OUT_PERCENT } = require('./config.js');
const { waitForGas, getTokenBalance } = require('./modules/helpers.js');
const { getUsdcModule, getEthModule } = require('./modules/index.js');
const { unwrapEth, wrapEth } = require('./modules/wrapUnwrap.js');
const { ETH, ZK_PROVIDER, USDC } = require('./utils/constants.js');
const { parseValue, cliCountDown, readWallets, logFile, getAccs } = require('./utils/utils.js');

async function process() {
  const keys = readWallets();
  if (!keys) return;
  const accs = getAccs(keys);
  console.log('Accounts = ', accs);
  for (let i = 0; i < accs.length; i++) {
    logFile(`Account: ${accs[i]}`);
    console.log('='.repeat(118));
    console.log(`${i}. Account: ${accs[i]}`);
    console.log('-'.repeat(118));
    try {
      const signer = new ethers.Wallet(keys[accs[i]], ZK_PROVIDER);
      const eth_balance = parseValue(await signer.getBalance(), 18);
      const eth_amount = (eth_balance / (AMOUNT_OUT_PERCENT * 100)).toFixed(8);
      if (!SWAP_TYPE) {
        const usdc_balance = parseValue(await getTokenBalance(signer, USDC), 6);
        if (usdc_balance) {
          await waitForGas();
          await getUsdcModule(signer, usdc_balance.toFixed(8))();
        } else {
          await waitForGas();
          await getEthModule(signer, eth_amount)();
        }
      } else {
        const weth_balance = parseValue(await getTokenBalance(signer, ETH), 18);
        if (weth_balance) {
          await waitForGas();
          await unwrapEth(signer, weth_balance.toFixed(6));
        } else {
          await waitForGas();
          await wrapEth(signer, eth_amount);
        }
      }
      console.log('='.repeat(118));
      logFile('='.repeat(118), false);
      await cliCountDown(
        Math.floor(Math.random() * (DELAY_ACC[1] - DELAY_ACC[0] + 1)) + DELAY_ACC[0],
      );
    } catch (e) {
      !e.code && console.log(e);
    }
  }
}

process();
