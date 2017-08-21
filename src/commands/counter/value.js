'use strict'

const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')

/* Export as Yargs command */
exports.command = 'value <dbname>'
exports.desc = 'Get the value of a counter database'

exports.builder = function (yargs) {
  return yargs
    .alias('get')
    .example('\n$0 value /stats/score', 
             '\nGets the current value of /stats/score')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(Object.assign({}, argv), { loadProgress: argv.progress })
    .then((db) => {
      process.stdout.write(`${db.value}\n`)
      return db.value
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
