'use strict'

const path = require('path')
const Logger = require('logplease')
const logger = Logger.create("orbitdb-counter-inc", { color: Logger.Colors.Yellow })

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')

/* Export as Yargs command */
exports.command = 'drop <database> yes'
exports.desc = 'Remove a database locally. This does not remove data on other nodes that have the removed database replicated.'

exports.builder = function (yargs) {
  return yargs
    .usage(`Usage: $0 drop <database> yes`)
}

exports.handler = (argv) => {
  if (!argv.yes || argv.yes.toLowerCase() !== 'yes') {
    process.stderr.write(`Can't drop the database. Confirm with: 'yes'\n`)
    process.exit(1)
  }

  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv)
    .then((db) => db.drop())
    .catch((e) => {
      if (e.message !== `Database '${argv.database}' doesn't exist.`)
        exitOnError(e)
    })
    .then(() => process.stdout.write(`Dropped database '${argv.database}'\n`))
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
