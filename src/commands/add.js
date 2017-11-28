'use strict'

const runCommand = require('../lib/run-command')
const exitOnError = require('../exit-on-error')
const pMapSeries = require('p-map-series')
const pipe = require('pipe-args').load(['add'])

const supportedDatabaseTypes = ['eventlog', 'feed']

/* Export as Yargs command */
exports.command = 'add <database> [<data>]'
exports.desc = `Add an entry to an eventlog or feed database. Can be only used on: ${supportedDatabaseTypes.join('|')}`

exports.builder = (yargs) => {
  return yargs
    .example('\n$0 add greetings "hello world!"',
             `\nAdd 'hello world!' to 'greetings' database`)
    .example('\n$0 add greetings --interactive',
             `\nOpen input prompt to add data to 'greetings' database`)
    .example('\n$0 add greetings -i -r --sync',
             `\nWait to connect to peers first, then open the input prompt to add data to 'greetings' database`)
    .example('\n\n== Piping ==\n\necho world | orbitdb add hello',
             `\n\n\n\nPipe 'world' to database 'hello'`)
    .option('interactive', {
      alias: 'i',
      describe: 'Opens a prompt and allows you to type in the data.',
      default: false,
    })
    .option('replicate', {
      alias: 'r',
      describe: 'Starts replicating the database after the entry was added.',
      default: false,
    })
    .option('sync', {
      alias: 's',
      describe: 'Add to database only when connected to peers.',
      default: false,
    })
}

exports.handler = async (argv) => {
  // Get stdin pipe if there's one
  const stdin = !argv.interactive ? process.argv[4] : null

  // Require input data unless we're going to open the input prompt
  // or we have a stdin pipe
  if (!argv.interactive && !argv.data && !stdin)
    exitOnError(new Error('No input data!'))

  // Add a event to the database and output the hash of the
  // database operation
  const operation = async (db, argv) => {
    // Adds data to the database and outputs the operation hash
    const add = async (data) => {
      // try {
        const hash = await db.add(data)
        process.stdout.write(`Added ${hash}\n`)
      // } catch (e) {
      //   if (e.toString().includes('Not allowed to write')) {
      //     throw new Error(`Not allowed to write to '${argv.database}'`)
      //   } else {
      //     throw e
      //   }
      // }
    }

    if (!stdin) {
      await add(argv.data)
    } else {
      // Parse stdin as new-line delimited entries
      const lines = stdin.split('\n')
      await pMapSeries(lines, add)
    }
  }

  try {
    await runCommand(argv.database, supportedDatabaseTypes, argv, operation)
  } catch (e) {
    if (e.toString().includes('Not allowed to write')) {
      throw new Error(`Not allowed to write to '${argv.database}'`)
    } else {
      throw e
    }
  }
}
