'use strict'

const createDatabase = require('../lib/create-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

exports.command = `create <database> <type>`
exports.aliases = 'new'
exports.desc = 'Create a new database\nTypes: eventlog|feed|docstore|keyvalue|counter'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 create <name> <eventlog|feed|docstore|keyvalue|counter>`)
    .example('\n$0 create /posts docstore', 
             '\nCreate a document database called \'/posts\'')
}

exports.handler = (argv) => {
  // console.log("ARGV", argv)
  const startTime = new Date().getTime()
  return createDatabase(argv.database, argv.type, argv)
    .then((db) => {
      process.stdout.write(`/orbitdb${db.path}\n`)
      return db
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))  
}
