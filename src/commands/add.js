'use strict'

const runCommand = require('../lib/run-command')
const exitOnError = require('../exit-on-error')

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
  // Require input data unless we're going to open the input prompt
  if (!argv.interactive && !argv.data)
    exitOnError(new Error('No input data!'))

  // Add a event to the database and output the hash of the
  // database operation
  const operation = async (db, argv) => {
    const hash = await db.add(argv.data)
    process.stdout.write(`Added ${hash}\n`)
  }
  await runCommand(argv.database, supportedDatabaseTypes, argv, operation)
}
