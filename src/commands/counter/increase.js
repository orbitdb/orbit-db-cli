'use strict'

const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')

const increase = (db, increment, options) => {
  const startTime = new Date().getTime()
  return db.inc(increment)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`Counter '${db.dbname}' increased to ${db.value} (${duration} ms)\n`)
    })
}

/* Export as Yargs command */
exports.command = 'increase <dbname> <value>'
exports.desc = 'Increase the value of a counter database'

exports.builder = function (yargs) {
  return yargs
    // .alias('inc')
    .example('\n$0 inc /stats/score 2', 
             '\nIncrease the counter /stats/score by 2')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(Object.assign({}, argv), { loadProgress: argv.progress })
    .then((db) => {
      return increase(db, JSON.parse(argv.value))
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
