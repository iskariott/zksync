const { shuffle } = require("./utils.js");
const fs = require('fs');
const path = require('path');
const moment = require('moment/moment');

const ACCOUNTS = 21;
const WEEKS = 3;

function round(value) {
  const m = value % 1;
  if (!value) return value;
  else if(Math.floor(m * 10) < 5) return Math.floor(value)
  else return  Math.floor(value)++
}

(() => {
  let data = moment().format('DD.MM.YY hh:mm:ss a') + '\n\n'
  const accsInDay = round(ACCOUNTS / 7);
  const accs = shuffle( Array.from(Array(ACCOUNTS).keys()))
  for (let i = 1; i <= WEEKS; i++) {
    data+= `Week ${i}\n`
    let newAccs = accs;
    for (let j = 1; j <= 7 && newAccs.length; j++) {
      data += `Day ${j}: ${newAccs.slice(0, accsInDay).join(',')}\n`
      newAccs = newAccs.slice(accsInDay);
    }
  }
  fs.writeFileSync(path.join(__dirname, '../sortedAccs.txt'), data)
})()


