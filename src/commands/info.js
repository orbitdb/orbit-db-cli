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
  argv = Object.assign({}, argv, { create: false, localOnly: true })
  return openDatabase(argv.database, argv)
    .then((db) => {
      process.stdout.write(db.address.toString() + '\n')
      process.stdout.write(`> Type: ${db.type}\n`)
      process.stdout.write(`> Owner: ${db.id}\n`)
      process.stdout.write(`> Data file: ./${db._cache.path}\n`)
      process.stdout.write(`> Entries: ${db.type === 'counter' ? 1 : db._oplog.length}\n`)
      process.stdout.write(`> Oplog length: ${db._oplog.length} / ${db.replicationStatus.max}\n`)
      process.stdout.write(`> Write-access: \n> ${db.access.write.join('\n> ')}\n`)
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
