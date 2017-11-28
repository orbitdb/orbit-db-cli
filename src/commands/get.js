'use strict'

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')
const search = require('../lib/docstore/search')
const replicate = require('../lib/replication-loop')

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('get', { color: Logger.Colors.Magenta })

/* Export as Yargs command */
exports.command = 'get <database> [<search>]'
exports.aliases = ['query', 'search']
exports.desc = 'Query the database.\n'

exports.builder = (yargs) => {
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
    .option('live', {
      describe: 'Query the database by connecting to the network first',
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
  let db
  const shouldReplicate = argv.replicate || argv.sync || argv.live
  const startTime = new Date().getTime()
  argv = Object.assign({}, argv, { localOnly: !shouldReplicate })
  return openDatabase(argv.database, argv)
    .then(async (result) => {
      db = result
      if (db.type === 'counter') {
        if (argv.output === 'json') {
          process.stdout.write(JSON.stringify({ value: db.value || 0 }))
          process.stdout.write('\n')
        } else {
          process.stdout.write(`${db.value}\n`)
        }
      } else if (db.type === 'eventlog' || db.type === 'feed') {
        const query = (displayHeader = false) => {
          const result = db.iterator({ limit: argv.limit || -1 }).collect()
          if (result.length > 0) {
            const sendTime = result[result.length - 1].payload.value
            const t = new Date(sendTime)
            const endTime = (new Date().getTime()) - (t.getTime())
            if (argv.output === 'json') {
              process.stdout.write(result.map(e => JSON.stringify(e)).join('\n'))
              process.stdout.write('\n')
            } else {
              if (displayHeader) process.stdout.write(`\n--- Last ${argv.limit || db._oplog.length} entries ---\n`)
              process.stdout.write(result.map(e => JSON.stringify(e.payload.value, null, 2)).join('\n'))
              process.stdout.write('\n')
              if (argv.timing)
                process.stdout.write(endTime + ' ms\n')
            }
          } else {
            process.stdout.write(`Database '${db.address.toString()}' is empty!\n`)
          }
        }

        if (shouldReplicate) {
          let shuttingDown = false
          const shutdown = async (delay = 0) => {
            logger.debug('Received SIGINT')
            if (!shuttingDown) {
              shuttingDown = true

              if (argv.interactive)
                process.stdout.write('\n')

              process.stdout.write('Shutting down...\n')

              // Give time to finish pending queries when
              // adding entries at an interval
              await new Promise(resolve => setTimeout(resolve, delay))

              process.stdout.write('Saving database... ')
              await db.saveSnapshot()
              process.stdout.write('Saved!\n')

              process.exit(0)
            }
          }

          // We're "online", give a little time to flush the queues
          process.on('SIGINT', () => shutdown(1000))

          query(true)
          db.events.on('replicated', () => query(true))
          await replicate(db, argv)
        } else {
          query()
        }
      } else if (db.type === 'keyvalue') {
        if (!argv.search)
          throw new Error('No key provided')
        const result = db.get(argv.search)
        if (result) {
          if (argv.output === 'json') {
            let val = {}
            val[argv.search] = result
            process.stdout.write(JSON.stringify(val, null, 2) + '\n')
          } else {
            process.stdout.write(result + '\n')
          }          
        } else {
          process.stdout.write(`No value set to key '${argv.search}'\n`)
        }
      } else if (db.type === 'docstore') {
        return search(db, argv.search, {
          interactive: argv.interactive && db.type === 'docstore',
          limit: argv.limit || -1,
          json: argv.output === 'json',
        })
      }
    })
    .catch(exitOnError)
    // .then(() => {
    //   if (shouldReplicate)
    //     return replicate(db)
    // })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))
}
