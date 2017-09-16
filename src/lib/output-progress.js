'use strict'

const progress = require('progress-string')
const padString = require('./pad-string')

const outputProgress = (action, dbname, count = 0, total = 0, startTime) => {
  const dt = new Date().getTime() - startTime
  const duration = new Date(dt).toISOString().substr(11, 8)
  const counterStr = padString(count + '/' + total, total.toString().length * 2 + 1, null, ' ', true)
  const percentage = (count / total * 100) || 0
  const percentageStr = padString((percentage || 0).toFixed(1), 5, '', '', true)
  const textLength = (dbname.length + 2 + action.length + 2)
  const infoTextlength = (counterStr.length + percentageStr.length + duration.length + 8)
  const splitProgressBar = textLength > Math.floor(process.stdout.columns / 2) ? '\n' : ''

  const bar = progress({
    width: splitProgressBar !== ''
      ? process.stdout.columns - infoTextlength
      : process.stdout.columns - infoTextlength - textLength,
    total: total - 1 || 1,
    complete: '█',
    incomplete: '░',
  })

  process.stdout.write('\r')
  process.stdout.write(action ? action + ' ' : '')
  process.stdout.write((dbname ? '\'' + dbname + '\' ' : '') + splitProgressBar)
  process.stdout.write(`${bar(count)} ${counterStr} | ${percentageStr}% | ${duration}`)
}

module.exports = outputProgress
