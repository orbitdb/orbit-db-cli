'use strict'

const rmrf = require('rimraf')
const path = require('path')

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('orbitdb-cli-drop', { color: Logger.Colors.Orange })

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

/* Export as Yargs command */
exports.command = 'drop <database> yes'
exports.aliases = ['destroy']
exports.desc = 'Remove a database locally. This doesn\'t remove data on other nodes that have the removed database replicated.'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 drop <database> yes`)
}

exports.handler = async (argv) => {
  if (!argv.yes || argv.yes.toLowerCase() !== 'yes') {
    process.stderr.write(`Can't drop the database. Confirm with: 'yes'\n`)
    process.exit(1)
  }

  const startTime = new Date().getTime()

  try {
    logger.debug(`Drop database ${argv.database}`)
    const db = await openDatabase(argv.database, argv)
    const dbCachePath = path.join('./', db._cache.path + '/' + db.address.toString().replace('/orbitdb/', '') + ".orbitdb")
    await db.drop()
    await db.close()
    rmrf.sync(dbCachePath)
  } catch (e) {
    exitOnError(e)
  }

  process.stdout.write(`Dropped database '${argv.database}'\n`)
  outputTimer(startTime, argv)
  process.exit(0)
}
