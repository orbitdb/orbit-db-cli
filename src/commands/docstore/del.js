'use strict'

const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')

const del = (db, key) => {
  process.stdout.write(`\nDelete '${key}' from '${db.dbname}'`)
  const startTime = new Date().getTime()
  return db.del(key)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`\n\Deleted ${hash} (${duration} ms)\n`)
    })
}

/* Export as Yargs command */
exports.command = 'del <dbname> <key>'
exports.desc = 'Delete a document from database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 del /posts "hello"', 
             '\nDelete document with index key "hello" (content)')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  openDatabase(argv, { loadProgress: true })
    .then((db) => {
      return del(db, argv.key)
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
