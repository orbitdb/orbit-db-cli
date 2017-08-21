'use strict'

const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')

/* Export as Yargs command */
exports.command = 'drop <dbname> <confirm>'
exports.desc = 'Drop database from the local orbit-db'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 drop /posts yes', '\nDrop database \'/posts\'')
}

exports.handler = (argv) => {
  if (!argv.confirm || argv.confirm !== 'yes') {
    process.stderr.write(`Can't drop the database. Confirm with: 'yes'\n`)
    process.exit(1)
  }

  const startTime = new Date().getTime()
  openDatabase(argv)
    .then((db) => db.drop())
    .catch(exitOnError)
    .then(() => process.stdout.write(`Dropped database '${argv.dbname}'\n`))
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
