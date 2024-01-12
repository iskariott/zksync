const { shuffle } = require("./utils.js");
const fs = require('fs');
const path = require('path');
const moment = require('moment/moment');

// кількість акаунтів
const ACCOUNTS = 21;

function round(value) {
  const m = value % 1;
  if (!value) return value;
  else if(Math.floor(m * 10) < 5) return Math.floor(value)
  else return  Math.floor(value)++
}

(() => {
  let data = moment().format('DD.MM.YY hh:mm:ss a') +  '\n' + '#'.repeat(20) + '\n'
  const accsInDay = round(ACCOUNTS / 7);
  for (let i = 1; i <= 4; i++) {
    data+= `\nWeek ${i}\n\n`
    let accs = shuffle(Array.from(Array(ACCOUNTS).keys()));
    for (let j = 1; j <= 7 && accs.length; j++) {
      data += `Day ${j}: ${accs.slice(0, accsInDay).join(',')}\n`
      accs = accs.slice(accsInDay);
    }
  }
  fs.writeFileSync(path.join(__dirname, '../sortedAccs.txt'), data)
})()


