'use strict'

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')

const add = (db, event, argv) => {
  const startTime = new Date().getTime()
  return db.add(event)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      if (argv.timing)
        process.stdout.write(`${hash} (${duration} ms)\n`)
      else
        process.stdout.write(`${hash}\n`)
    })
}

/* Export as Yargs command */
exports.command = 'add <database> <event>'
exports.desc = 'Add an event to an eventlog or feed database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 add greetings "hello world!"',
             '\nAdd \'hello world!\' to \'greetings\' database')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv, 'eventlog')
    .then((db) => validateDatabaseType(db, ['feed', 'eventlog']))
    .then((db) => {
      return add(db, argv.event, argv)
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
