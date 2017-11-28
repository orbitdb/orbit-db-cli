'use strict'

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('orbitdb-cli-create', { color: Logger.Colors.Green })

const createDatabase = require('../lib/create-database')
const outputTimer = require('../lib/output-timer')

const types = ['eventlog', 'feed', 'docstore', 'keyvalue', 'counter']

exports.command = `create <database> <type>`
exports.aliases = 'new'
exports.desc = `Create a new database. Type can be one of: ${types.join('|')}`

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 create <name> <${types.join('|')}>`)
    .example('\n$0 create /posts docstore',
             '\nCreate a document database called \'/posts\'')
}

exports.handler = async (argv) => {
  const startTime = new Date().getTime()
  try {
    const db = await createDatabase(argv.database, argv.type, argv)
    process.stdout.write(`${db.address.toString()}\n`)
  } catch (e) {
    console.error('Error:', e.message)

    if (e.toString().includes('Invalid database type'))
      process.stdout.write(`Database type can be one of: ${types.join('|')}\n`)

    logger.error(e.stack)

    process.exit(1)
  }
  outputTimer(startTime, argv)
  process.exit(0)
}
