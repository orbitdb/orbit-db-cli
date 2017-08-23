'use strict'

const Logger = require('logplease')
const logger = Logger.create("orbitdb-docstore-put", { color: Logger.Colors.Yellow })
const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')

const put = (db, doc, options) => {
  const startTime = new Date().getTime()
  return db.put(doc)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`Added document '${doc[options.indexBy || '_id']}'\n`)
    })
}

/* Export as Yargs command */
exports.command = 'put <database> <document>'
exports.desc = 'Add a document to a document database'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 put /posts "{\\"id\\":\\"1\\",\\"author\\":\\"haad\\",\\"content\\":\\"Hello friend\\"}" --indexBy content', 
             '\nAdd a document to the database, index by the field \'content\'')
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv, 'docstore')
    .then((db) => validateDatabaseType(db, 'docstore'))
    .then((db) => {
      return put(db, JSON.parse(argv.document), { limit: argv.limit || -1, indexBy: argv.indexBy })
        .then(() => db.saveSnapshot())
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
