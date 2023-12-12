const { ethers } = require('ethers');
const {
  DELAY_ACC,
  ACCS,
  SWAP_TYPE,
  AMOUNT_OUT_PERCENT,
  ACCS_PACK,
  ACCS_NUMBERS,
} = require('./config.js');
const { waitForGas, getTokenBalance } = require('./modules/helpers.js');
const { getUsdcModules, getEthModules } = require('./modules/index.js');
const { unwrapEth, wrapEth } = require('./modules/wrapUnwrap.js');
const { ETH, ZK_PROVIDER, USDC } = require('./utils/constants.js');
const { parseValue, cliCountDown, readWallets, c, logFile, shuffle } = require('./utils/utils.js');

function process() {
  const keys = readWallets();
  let accs = [];
  if (ACCS_PACK.length && ACCS_NUMBERS.length)
    throw new Error(c.red('Cannot use ACCS_PACK and ACCS_NUMBERS together. Change config.js'));
  if (ACCS_PACK.length) {
    if (ACCS_PACK[1] >= keys.length)
      throw new Error(
        c.red(
          `The number of accounts is greater than in the wallets.txt. Please change ACCS_PACK in the config.js `,
        ),
      );
    accs = Array.from(Array(ACCS_PACK[1] - ACCS_PACK[0] + 1)).map((_, idx) => idx + ACCS_PACK[0]);
  } else {
    if (ACCS_NUMBERS.sort((a, b) => a - b).pop() >= keys.length)
      throw new Error(
        c.red(
          `The number of accounts is greater than in the wallets.txt. Please change ACCS_NUMBERS in the config.js `,
        ),
      );
    accs = ACCS_NUMBERS;
  }

  if (RANDOMIZE_WALLETS) accs = shuffle(accs);

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
  });
}

process();
