'use strict'

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const search = require('../lib/docstore/search')

/* Export as Yargs command */
exports.command = 'get <database> [<search>]'
exports.aliases = ['query', 'search']
exports.desc = 'Query the database.\n'

exports.builder = function (yargs) {
  return yargs
    .usage('This command is used to query a database in orbit-db.\n' +
           '\nUsage: $0 get|search|query <database> [<search>]')
    .example('\n$0 get /posts',
             '\nQuery all results from /posts when /posts is an eventlog')
    .example('\n$0 get /posts --limit 1',
             '\nQuery the latest event from /posts when /posts is an eventlog')
    .example('\n$0 search /users QmFoo1',
             '\nSearch the index field for \'QmFoo1\' from /users when /users is a document store')
    .example('\n$0 query /users -i',
             '\nOpen the search prompt to search from /users (search prompt only for docstore databases)')
    .option('interactive', {
      alias: 'i',
      describe: 'Display interactive search prompt\n(only for docstore databases)',
      default: false,
    })
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
      } else if (db.type === 'eventlog' || db.type === 'feed') {
        const result = db.iterator({ limit: argv.limit || -1 }).collect().map(e => e)
        if (result.length > 0) {
          process.stdout.write(result.map(e => JSON.stringify(e, null, 2)).join('\n'))
          process.stdout.write('\n')
        } else {
          process.stdout.write(`Database '${db.dbname}' is empty!\n`)
        }
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
          interactive: argv.interactive && db.type === 'docstore',
          limit: argv.limit || -1,
          json: argv.output === 'json',
        })
      }
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
