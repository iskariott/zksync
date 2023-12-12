/*
Пачка акаунтів з номерами від 0 до 10
Нумерація починається з 0
*/
const ACCS = [0, 1];

/*
Відсоток від баланса (ETH) який буде свапатися
*/
const AMOUNT_OUT_PERCENT = 5;

/*
Затримка між акаунтами
Перша цифра мінімальна затримка друга максимальна в секундах.
*/
const DELAY_ACC = [60, 240];

/*
Максимальний газ в Ефір мережі.
Якщо газ буде більший скрипт буде очікувати допустимий газ.
*/
const ALLOWED_GWEI = 40;

/*
Затримка (в секундах) між перевірками газу коли він вищий за значення ALLOWED_GWEI
*/
const CHECK_GAS_DELAY = 300;

/*
0 - свап ETH-USDC (якщо на балансі будуть USDC тоді свап USDC-ETH)
1 - врап ETH-WETH (якщо на балансі будуть WETH тоді анврап)
*/
const SWAP_TYPE = 0;

/*
Скільки токенів USDC апрувати
*/
const APPROVE_AMOUNT = 100;

const GAS_LIMIT = 626948;

module.exports = {
  ACCS,
  AMOUNT_OUT_PERCENT,
  DELAY_ACC,
  ALLOWED_GWEI,
  CHECK_GAS_DELAY,
  SWAP_TYPE,
  APPROVE_AMOUNT,
  GAS_LIMIT,
};
