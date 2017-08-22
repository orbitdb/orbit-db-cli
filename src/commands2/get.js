'use strict'

const Logger = require('logplease')
const logger = Logger.create("orbitdb-counter-inc", { color: Logger.Colors.Yellow })

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const validateDatabaseType = require('../validate-database-type')
const search = require('../lib/docstore/search')

/* Export as Yargs command */
exports.command = 'get <database> [<search>]'
exports.aliases = 'query'
exports.desc = 'Query the database'

exports.builder = function (yargs) {
  return yargs
    .usage(`Usage: $0 get <database> [<search>]`)
    .example('\n$0 get /posts', 
             '\nQuery all results from /posts when /posts is an eventlog')
    .example('\n$0 get /posts QmFoo1', 
             '\nSearch the index field for \'QmFoo1\' from /posts when /posts is a document store')
    .option('progress', {
      alias: 'p',
      describe: 'Display pretty progress bars',
      default: false,
    })
    .option('limit', {
      alias: 'l',
      describe: 'Limit how many entries to load to the database',
      default: -1,
    })
    .option('timing', {
      alias: 't',
      describe: 'Display how long the command took to run',
      default: false,
    })
}

exports.handler = (argv) => {
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv)
    .then((db) => {
      if (db.type === 'counter') {
        process.stdout.write(`${db.value}\n`)
      } else if (db.type === 'eventlog') {
        const result = db.iterator().collect()
        process.stdout.write(result + '\n')
      } else if (db.type === 'keyvalue') {
        if (!argv.search)
          throw new Error('No key provided')
        const result = db.get(argv.search)
        if (result)
          process.stdout.write(result + '\n')
        else
          process.stdout.write(`No value set to key '${argv.search}'\n`)
      } else if (db.type === 'docstore') {
        return search(db, argv.search, { 
          interactive: argv.interactive, 
          limit: argv.limit || -1, 
          json: argv.output === 'json',
        })        
      }
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
