'use strict'

const progress = require('progress-string')
const padString = require('./pad-string')

const outputProgress = (action, dbname, count = 0, total = 1, startTime) => {
  const bar = progress({ 
    width: 48, 
    total: total || 1,
    complete: '█',
    incomplete: '░',
  })

  const dt = new Date().getTime() - startTime
  const duration = new Date(dt).toISOString().substr(11, 8)
  const counterStr = padString(count + '/' + total, total.toString().length * 2 + 1, null, ' ', true)
  const percentage = count / total * 100
  const percentageStr = padString((percentage).toFixed(1), 5, '', '', true)

  process.stdout.write('\r')
  process.stdout.write(`${action} '${dbname}' ${bar(count)} ${counterStr} | ${percentageStr}% | ${duration}`)
}

module.exports = outputProgress
