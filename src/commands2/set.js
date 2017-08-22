'use strict'

const Logger = require('logplease')
const logger = Logger.create("orbitdb-keyvalue-set", { color: Logger.Colors.Orange })
const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')

const set = (db, key, value, options) => {
  const startTime = new Date().getTime()
  return db.set(key, value)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`'${key}' set to '${value}' (${hash})\n`)
    })
}

/* Export as Yargs command */
exports.command = 'set <database> <key> <value>'
exports.desc = 'Set a value of a key in KeyValue database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 set logins.last id haad', 
             '\nSet key id to haad in logins.last database')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv, 'keyvalue')
    .then((db) => validateDatabaseType(db, 'keyvalue'))
    .then((db) => {
      return set(db, argv.key, argv.value)
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
