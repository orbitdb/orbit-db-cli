'use strict'

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('replication-loop', { color: Logger.Colors.Cyan })

const outputProgress = require('./output-progress')
const padString = require('./pad-string')

const replicate = (db, argv = {}) => {
  const jsonOutput = argv.output === 'json'
  let startTime = new Date().getTime()
  let i = 0
  let peerCount = 0
  let latestProgress = 0
  let bytesDownloaded = 0

  const clearScreen = () => {
    process.stdout.write('\x1B[2J\x1B[0f')
  }

  return new Promise((resolve, reject) => {
    if (argv.progress || jsonOutput) {
      const outputJson = (id, json = false) => {
        process.stdout.write(JSON.stringify({ id : id, progress: db._replicationInfo.progress, max: db._replicationInfo.max }))
        process.stdout.write('\n')
      }

      const output = (id) => {
        if (jsonOutput) {
          outputJson(id)
          return
        }

        outputProgress('Replicating', id, db._replicationInfo.progress, db._replicationInfo.max, startTime)
      }

      db.events.on('replicate', (id) => {
        if (db._replicationInfo.max > latestProgress) {
          latestProgress = db._replicationInfo.max
          output(id)
        }
      })

      db.events.on('replicated', (id, replicatedPiecesCount) => {
        output(id)
      })
    }

    db.events.on('error', (err) => {
      console.error(err)
    })

    if (argv.progress) {
      outputProgress('Replicating', db.address.toString(), db._replicationInfo.progress, db._replicationInfo.max, new Date().getTime())
    } else if (jsonOutput) {
      // Output nothing
    } else {
      process.stdout.write(`Replicating '${db.address.toString()}'`)
    }
  })
}

module.exports = replicate
