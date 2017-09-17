'use strict'

const path = require('path')
const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

/* Export as Yargs command */
exports.command = 'info <database>'
exports.aliases = 'status'
exports.desc = 'Show information about a database'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 info <database>`)
    .example('\n$0 info /posts',
             '\nShow information about /posts')
    .option('progress', {
      alias: 'p',
      describe: 'Display pretty progress bars',
      default: false,
    })
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv)
    .then((db) => {
      process.stdout.write(db.path + '\n')
      process.stdout.write(`> Type: ${db.type}\n`)
      process.stdout.write(`> Owner: ${db.id}\n`)
      process.stdout.write(`> Data file: ./${path.join('./', db._cache.path, db._cache.filename)}\n`)
      process.stdout.write(`> Entries: ${db.type === 'counter' ? 1 : Object.keys(db._index._index).length}\n`)
      process.stdout.write(`> Oplog length: ${db._oplog.length}\n`)
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
