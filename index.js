const { ethers } = require('ethers');
const { DELAY_ACC, SWAP_TYPE, AMOUNT_OUT_PERCENT } = require('./config.js');
const { waitForGas, getTokenBalance } = require('./modules/helpers.js');
const { getUsdcModule, getEthModule } = require('./modules/index.js');
const { unwrapEth, wrapEth } = require('./modules/wrapUnwrap.js');
const { ETH, ZK_PROVIDER, USDC } = require('./utils/constants.js');
const { parseValue, cliCountDown, readWallets, logFile, getAccs } = require('./utils/utils.js');

function process() {
  const keys = readWallets();
  const accs = getAccs(keys);
  accs.forEach(async (i) => {
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
      const eth_balance = parseValue(await signer.getBalance(), 18);
      const eth_amount = (eth_balance * (AMOUNT_OUT_PERCENT / 100)).toFixed(6);
      if (!SWAP_TYPE) {
        const usdc_balance = parseValue(await getTokenBalance(signer, USDC), 6);
        if (usdc_balance) {
          await waitForGas();
          await getUsdcModule(signer, usdc_balance.toFixed(6))();
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
  });
}

process();
