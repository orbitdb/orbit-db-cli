'use strict'

const runCommand = require('../lib/run-command')

const increase = async (db, increment, options) => {
  const hash = await db.inc(increment)
  process.stdout.write(db.value + '\n')
}

/* Export as Yargs command */
exports.command = 'inc <database> [<increment>]'
exports.aliases = 'increase'
exports.desc = 'Increase the value of a counter database. Default increment is 1.'

exports.builder = function (yargs) {
  return yargs
    .example('\n$0 inc /stats/score',
             '\nIncrease the counter /stats/score by 1')
    .example('\n$0 increase /stats/score 2',
             '\nIncrease the counter /stats/score by 2')
}

exports.handler = async (argv) => {
  const increment = parseInt(argv.increment)
  const operation = async (db) => {
   if (!increment && argv.increment)
      throw new Error(`Invalid input value '${argv.increment}'. Input must be a number.`)

    if (increment && increment < 1 || increment === 0)
      throw new Error(`Invalid input value ${argv.increment}. Input must be greater than 0.`)

    await increase(db, increment || 1)
  }

  await runCommand(argv.database, ['counter'], argv, operation)
}
