'use strict'

const path = require('path')
const startIpfs = require('../start-ipfs.js')
const config = require('../config')
const initDB = require('../init-db.js')
const hookProgressOutput = require('../hook-output-progress')
const OrbitDB = require('orbit-db')

const Logger = require('logplease')
const logger = Logger.create("orbitdb-openDatabase", { color: Logger.Colors.Green })

const openDatabase = async (database, argv, openAsType) => {
  // TODO: add database path config: { repo: path.join('./.orbitdb') }
  logger.debug('Starting IPFS')
  const ipfs = await startIpfs(config.ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  const orbitdb = new OrbitDB(ipfs, peerId)
  const p = path.join('.orbitdb')
  logger.debug('Loading database')
  return orbitdb.load(database, './.orbitdb', peerId, { 
      maxHistory: -1,
      indexBy: argv.indexBy,
      replicate: false,
      loadAsType: openAsType,
    })
    .then((db) => {
      if (argv.progress && argv.output !== 'json') {
        hookProgressOutput(db, argv, `Loading database`, new Date().getTime())      
        process.stdout.write(`Loading database '${db.dbname}' (${db.type})`)
      }
      logger.debug('Database loaded')

      return db.loadFromSnapshot()
    })
    .then((db) => {
      if (argv.progress && argv.output !== 'json')
        process.stdout.write('\n')

      return db
    })
}

module.exports = openDatabase
