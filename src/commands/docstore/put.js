'use strict'

const openDatabase = require('../../lib/open-database')
const outputTimer = require('../../lib/output-timer')
const exitOnError = require('../../exit-on-error')

const put = (db, document, options) => {
  process.stdout.write(`\nIndex as '${document[options.indexBy || '_id']}' (${options.indexBy}) to '${db.dbname}'`)
  const startTime = new Date().getTime()
  return db.put(document)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`\n\Added ${hash} (${duration} ms)\n`)
    })
}

/* Export as Yargs command */
exports.command = 'put <dbname> <document>'
exports.desc = 'Add a document to database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 put /posts "{\\"id\\":\\"1\\",\\"author\\":\\"haad\\",\\"content\\":\\"Hello friend\\"}" content', 
             '\nAdd a document to the database, index by the field \'content\'')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv, { loadProgress: true })
    .then((db) => {
      return put(db, JSON.parse(argv.document), { limit: argv.limit || -1, indexBy: argv.indexBy })
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}