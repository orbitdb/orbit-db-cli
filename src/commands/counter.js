'use strict'

const openDatabase = require('../lib/open-database')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

const command = 'counter'

exports.command = `${command} <database> <command> [<value>]`
exports.desc = 'Counter Database'

exports.builder = (yargs) => {
  return yargs
    .commandDir(command)
    // .command(['*'], 'the serve command', () => {}, (argv) => {
    //   console.log('this command will be run by default', argv)
    // })
    .usage(`Usage: $0 <database> <command>`)
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
  // console.log("ARGV", argv)
  const startTime = new Date().getTime()
  return openDatabase(argv.database, argv, { loadProgress: argv.progress })
    .then((db) => validateDatabaseType(db, 'counter'))
    .then((db) => {
      if (argv.command === 'increase' || argv.command === 'inc') {
        const value = parseInt(argv.value)

        if (!value && argv.value)
          throw new Error(`Invalid input value '${argv.value}'. Input must be a number.`)
        
        if (value && value < 1 || value === 0)
          throw new Error(`Invalid input value ${argv.value}. Input must be greater than 0.`)

        return increase(db, value || 1)
          .then(() => db.saveSnapshot())
      } else if (argv.command === 'value') {
        process.stdout.write(`${db.value}\n`)
        return db.value  
      }
    })
    .catch(exitOnError)
    .then(() => outputTimer(startTime, argv))
    .then(() => process.exit(0))  
}

const validateDatabaseType = (db, type) => {
  if (db.type !== type)
    throw new Error(`Database '${db.dbname}' (${db.type}) is not a ${type} database.`)
  return db  
}

const increase = (db, increment, options) => {
  const startTime = new Date().getTime()
  return db.inc(increment)
    .then((hash) => {
      const duration = new Date().getTime() - startTime
      process.stdout.write(`Counter '${db.dbname}' increased to ${db.value}\n`)
    })
}

const value = (db) => {
  process.stdout.write(`${db.value}\n`)
  return db.value  
}