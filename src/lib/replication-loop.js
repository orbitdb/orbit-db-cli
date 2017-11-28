'use strict'

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('replication-loop', { color: Logger.Colors.Cyan })

const outputProgress = require('./output-progress')
const outputReplicationInfo = require('./output-replication-info')
const padString = require('./pad-string')

const replicate = (db, argv = {}) => {
  const jsonOutput = argv.output === 'json'
  let startTime = new Date().getTime()
  let i = 0
  let peerCount = 0
  let latestHave = {}
  let latestProgress = 0
  let bytesDownloaded = 0

  const dashboardMode = argv.dashboard || false

  const clearScreen = () => {
    process.stdout.write('\x1B[2J\x1B[0f')
  }

  const interval = setInterval(async () => {
    const peers = await db._ipfs.pubsub.peers(db.address.toString())
    if (argv.progress && peers.length != peerCount && !jsonOutput) {
      if (dashboardMode) clearScreen()
      latestHave = Object.assign({}, latestHave, db._replicationInfo.have)
      outputProgress('Replicating', db.address.toString(), db._oplog.length, db._replicationInfo.max, startTime)
      if (dashboardMode) {
        outputReplicationInfo(db, null, db._replicationInfo.max, startTime, latestHave, true, peers.length, bytesDownloaded)
      }
    }
    peerCount = peers.length
  }, 500)

  return new Promise((resolve, reject) => {
    if (argv.progress || jsonOutput) {
      const outputJson = (id, have, json = false) => {
        process.stdout.write(JSON.stringify({ id : id, progress: db._replicationInfo.progress, max: db._replicationInfo.max }))
        process.stdout.write('\n')
      }

      const output = (id, have) => {
        if (jsonOutput) {
          outputJson(id, have)
          return
        }

        if (dashboardMode) 
          clearScreen()

        outputProgress('Replicating', id, db._replicationInfo.progress, db._replicationInfo.max, startTime)

        if (dashboardMode) {
          latestHave = Object.assign({}, latestHave, have)
          outputReplicationInfo(db, null, db._replicationInfo.max, null, latestHave, true, peerCount, bytesDownloaded)
        }
      }

      db.events.on('replicate', (id) => {
        output(id, db._replicationInfo.have)
      })

      db.events.on('replicate.progress', (id, hash, entry, progress, replicatedPieces) => {
        if (!jsonOutput) {
          bytesDownloaded += Buffer.from(JSON.stringify(entry)).length
          output(id, replicatedPieces)
        }
      })

      db.events.on('replicated', (id, replicatedPiecesCount) => {
        output(id, db._replicationInfo.have)
      })
    }

    db.events.on('error', (err) => {
      console.error(err)
    })

    if (argv.progress) {
      if (dashboardMode) {
        clearScreen()
        outputProgress('Replicating', db.address.toString(), db._replicationInfo.progress, db._replicationInfo.max, new Date().getTime())
        outputReplicationInfo(db, null, db._replicationInfo.max, null, db._replicationInfo.have)
      } else {
        outputProgress('Replicating', db.address.toString(), db._replicationInfo.progress, db._replicationInfo.max, new Date().getTime())
      }
    } else if (jsonOutput) {
      // Output nothing
    } else {
      process.stdout.write(`Replicating '${db.address.toString()}'`)
    }
  })
}

module.exports = replicate
