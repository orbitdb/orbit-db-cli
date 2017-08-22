'use strict'

const Logger = require('logplease')
const logger = Logger.create("orbitdb-counter-inc", { color: Logger.Colors.Yellow })

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')

const increase = (db, increment, options) => {
  const startTime = new Date().getTime()
  return db.inc(increment)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(db.value + '\n')
      logger.debug(`Counter increase took ${duration} ms`)
    })
}

/* Export as Yargs command */
exports.command = 'inc <database> [<value>]'
exports.aliases = 'increase'
exports.desc = 'Increase the value of a counter database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 inc /stats/score', 
             '\nIncrease the counter /stats/score by 1')
    .example('\n$0 increase /stats/score 2', 
             '\nIncrease the counter /stats/score by 2')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv, 'counter')
    .then((db) => validateDatabaseType(db, 'counter'))
    .then((db) => {
      const value = parseInt(argv.value)

       if (!value && argv.value)
          throw new Error(`Invalid input value '${argv.value}'. Input must be a number.`)
        
        if (value && value < 1 || value === 0)
          throw new Error(`Invalid input value ${argv.value}. Input must be greater than 0.`)

        return increase(db, value || 1)
         .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
