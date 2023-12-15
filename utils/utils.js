const readline = require('readline');
const fs = require('fs');
const path = require('path');
const moment = require('moment/moment');
const { ACCS_NUMBERS, ACCS_PACK, RANDOMIZE_WALLETS } = require('../config');

const c = {
  grn: (t) => `\x1b[32m${t}\x1b[0m`,
  dim: (t) => `\x1b[90m${t}\x1b[0m`,
  yel: (t) => `\x1b[33m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  blu: (t) => `\x1b[34m${t}\x1b[0m`,
};

async function getETHPrice() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  );
  return response.json().then((r) => r.ethereum.usd);
}

function findObjKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

function cliCountDown(time_s) {
  return new Promise((resolve) => {
    function updateLine(content, finished = false) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      !finished && process.stdout.write(`${c.dim('Delay: ' + content + 's')}`);
    }

    updateLine(time_s);
    let timer = setInterval(() => {
      time_s -= 1;

      if (time_s <= 0) {
        clearInterval(timer);
        updateLine(0, true);
        resolve();
      } else {
        updateLine(time_s);
      }
    }, 1000);
  });
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function parseValue(value, pow = 18) {
  return parseInt(value) / Math.pow(10, pow);
}

function readWallets() {
  return fs.readFileSync('./wallets.txt', { encoding: 'utf-8' }).toString().split('\r\n');
}

// async function calculateGas(gasLimitHex) {
//   const gasLimit = parseValue(gasLimitHex, 0);
//   console.log('gasLimit = ', gasLimit);
//   const gwei = await ETH_PROVIDER.getGasPrice(21144265).then((r) => parseValue(r, 9));
//   console.log('gwei = ', gwei);
//   const ethPrice = await getETHPrice();
//   console.log('ethPrice = ', ethPrice);
//   return parseValue(gwei * gasLimit, 11) * ethPrice;
// }

function logFile(content, time = true) {
  let data = '';
  if (time) data = moment().format('DD.MM.YY hh:mm:ss a') + ' # ';
  data = data.concat(content + '\n');
  fs.appendFileSync(path.join(__dirname, '../out.txt'), data);
}

function getAccs(keys) {
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
    console.log('ACCS_NUMBERS = ', ACCS_NUMBERS);
    if (ACCS_NUMBERS.sort((a, b) => a - b)[-1] >= keys.length)
      throw new Error(
        c.red(
          `The number of accounts is greater than in the wallets.txt. Please change ACCS_NUMBERS in the config.js `,
        ),
      );
    console.log('ACCS_NUMBERS = ', ACCS_NUMBERS);
    accs = ACCS_NUMBERS;
  }

  if (RANDOMIZE_WALLETS) accs = shuffle(accs);
  return accs;
}

module.exports = {
  parseValue,
  shuffle,
  cliCountDown,
  getETHPrice,
  c,
  readWallets,
  findObjKeyByValue,
  // calculateGas,
  logFile,
  getAccs,
};
