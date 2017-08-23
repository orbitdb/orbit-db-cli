'use strict'

const startIpfs = require('../start-ipfs.js')
const config = require('../config')
const hookProgressOutput = require('../hook-output-progress')
const OrbitDB = require('orbit-db')

const Logger = require('logplease')
const logger = Logger.create('open-database', { color: Logger.Colors.Green })

const openDatabase = async (database, argv, openAsType) => {
  // TODO: add database path config: { repo: path.join('./.orbitdb') }
  logger.debug('Starting IPFS')
  const ipfs = await startIpfs(config.ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  const orbitdb = new OrbitDB(ipfs, peerId)
  const directory = config.defaultDatabaseDir
  logger.debug(`Loading database '${database}'`)
  return orbitdb.load(database, directory, peerId, {
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

    return db.loadFromSnapshot()
  })
  .then((db) => {

    if (argv.progress && argv.output !== 'json')
      process.stdout.write('\n')

    if (db)
      logger.debug(`Database '${db.dbname}' loaded (type: ${db.type}, entries: ${db._index._index ? Object.keys(db._index._index).length : 0})`)

    return db
  })
}

module.exports = openDatabase
