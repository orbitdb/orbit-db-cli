'use strict'

const runCommand = require('../lib/run-command')

const supportedDatabaseTypes = ['eventlog', 'feed', 'docstore', 'keyvalue', 'counter']

/* Export as Yargs command */
exports.command = 'replicate <database>'
exports.aliases = []
exports.desc = 'Replicate a database with peers.'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 replicate <database>`)
    .example('\n$0 replicate /counter1',
             '\nReplicate database \'/counter1\'')
    .option('progress', {
      alias: 'p',
      describe: 'Display pretty progress bars',
      default: false,
    })
    .option('dashboard', {
      describe: 'Display replication status on a dashboard',
      default: false,
    })
    .option('from', {
      describe: 'From PeerID',
      default: false,
    })
}

exports.handler = async (argv) => {
  // runcommand() will start replication if '--replicate' is passed
  // as a command line argument, so we just force it here and
  argv.replicate = true
  await runCommand(argv.database, supportedDatabaseTypes, argv)
}
