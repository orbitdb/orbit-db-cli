'use strict'

const Logger = require('logplease')
Logger.setLogLevel('NONE') // turn off logs
const logger = Logger.create('open-database', { color: Logger.Colors.Green })

const path = require('path')
const OrbitDB = require('orbit-db')
const config = require('../config')
const startIpfs = require('../start-ipfs.js')
const hookProgressOutput = require('../hook-output-progress')

const openDatabase = async (database, argv, openAsType) => {
  const replicate = (argv.replicate || argv.sync || argv.live || argv.interactive || argv._.includes('replicate'))
  const live = replicate || false

  logger.debug('Starting IPFS')
  const ipfsConfig = Object.assign({}, config.ipfsConfig, { start: live })
  logger.debug(`Going online: ${ipfsConfig.start}`)
  if (ipfsConfig.start) logger.info(`IPFS going online!`)

  const ipfs = await startIpfs(ipfsConfig)

  const peerId = await ipfs.config.get('Identity.PeerID')
  logger.debug("PeerID:", peerId)

  const directory = process.env.ORBITDB_PATH || config.defaultDatabaseDir
  const orbitdb = new OrbitDB(ipfs, directory, { peerId: peerId })

  logger.debug(`Loading database '${database}'`)

  const db = await orbitdb.open(database, {
    maxHistory: -1,
    indexBy: argv.indexBy,
    replicate: replicate || false,
    type: openAsType,
    create: openAsType ? true : false,
    key: argv.key,
    sync: replicate,
    localOnly: argv.localOnly || false
  })

  if (argv.progress && argv.output !== 'json') {
    hookProgressOutput(db, argv, `Loading`, new Date().getTime())
    process.stdout.write(`Loading '${db.address.toString()}' (${db.type})`)
  }

  try {
    await db.loadFromSnapshot()
  } catch (e) {
    if (e.toString() === `Snapshot for ${database} not found!`) {
      throw new Error(`Database '${database}' doesn't exist.`)
    }
  }

  if (argv.progress && argv.output !== 'json')
    process.stdout.write('\n')

  if (db)
    logger.debug(`Database '${db.address.toString()}' loaded (type: ${db.type}, entries: ${db._index._index ? Object.keys(db._index._index).length : 0})`)

  return db
}

module.exports = openDatabase
