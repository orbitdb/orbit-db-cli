'use strict'

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('run-command', { color: Logger.Colors.Cyan })

const readline = require('readline')
const pWhilst = require('p-whilst')
const openDatabase = require('../lib/open-database')
const validateDatabaseType = require('../validate-database-type')
const replicate = require('../lib/replication-loop')
const waitForPeers =  require('../lib/wait-for-peers')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const runCommand = async (database, validTypes, argv, operation, onError) => {
  const startTime = new Date().getTime()

  try {
    const db = await openDatabase(database, argv)
    validateDatabaseType(db, validTypes)

    // If 'synchronous' flag is on, wait first for peers
    // to connect
    if (argv.sync)
      await waitForPeers(db)

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

    // If we were "online", give a little time to flush the queues
    if (argv.interactive || argv.interval || argv.replicate || argv.sync) {
      process.on('SIGINT', () => shutdown(1000))
    }

    // Run the actual database command and track its duration
    if (operation) {
      const waitForInput = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))
      const queryLoop = async () => {
        const text = await waitForInput('> ')
          try {
          // if (text) {
            // argv.data = !text || text === '' ? '' : text // uncomment for ipfs-cached content (ie. no network delay)
            argv.data = (!text || text === '') ? new Date().toISOString() : text
            await operation(db, argv)
          // }
          } catch (e) {
            console.log(e.toString())
          }
      }

      if (argv.interactive) {
        // Update database by sending it command line input
        process.stdout.write('Press CTRL+C twice to exit the program\n')
        replicate(db, argv)
        return pWhilst(() => true, queryLoop)
          .catch(e => console.log(e))
      } else if (argv.interval) {
        // Update database at an interval
        let running = false
        let canRun = true
        const originalInput = argv.data
        process.on('SIGINT', () => canRun = false)
        setInterval(async () => {
          if (canRun && !running) {
            running = true
            argv.data = originalInput + ' ' + new Date().toISOString()
            await operation(db, argv)
            running = false
          }
        }, argv.interval)

        // If an argument was passed to end the interval run after a certain time
        if (argv.endAfter) {
          return new Promise(resolve => {
            setTimeout(() => {
              canRun = false
              shutdown()
            }, argv.endAfter)
          })
        }

        return new Promise(resolve => {})
      } else {
        // Default: run once and exit
        const commandStartTime = new Date().getTime()
        await operation(db, argv)
        const duration = new Date().getTime() - commandStartTime
        if (argv.timing || argv.t) 
          process.stdout.write(`Command: ${duration} ms\n`)
      }
    }

    // Persist the current state of the database to disk
    await db.saveSnapshot()

    // If 'replicate' flag is on, start replication
    if (argv.replicate)
      await replicate(db, argv)
  } catch(e) {
    if (onError) 
      onError(e)
    exitOnError(e)
  }

  outputTimer(startTime, argv)

  process.exit(0)
}

module.exports = runCommand
