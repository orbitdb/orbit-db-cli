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
  const replicate = argv.replicate || argv.sync || argv._.includes('replicate')
  const live = replicate || argv.interactive ? true : false
  // TODO: add database path config: { repo: path.join('./.orbitdb') }
  logger.debug('Starting IPFS')
  const ipfsConfig = Object.assign({}, config.ipfsConfig, { start: live })
  logger.debug(`Going online: ${ipfsConfig.start}`)
  if (ipfsConfig.start) logger.info(`IPFS going online!`)

  const ipfs = await startIpfs(ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  const orbitdb = new OrbitDB(ipfs)
  const directory = process.env.ORBITDB_PATH || config.defaultDatabaseDir

  logger.debug(`Loading database '${database}'`)

  const db = await orbitdb.load(database, directory, {
    maxHistory: -1,
    indexBy: argv.indexBy,
    replicate: live || false,
    type: openAsType,
    create: openAsType ? true : false,
  })

  if (!db)
    throw new Error(`Database '${database}' doesn't exist.`)

  if (argv.progress && argv.output !== 'json') {
    hookProgressOutput(db, argv, `Loading`, new Date().getTime())
    process.stdout.write(`Loading '${db.path}' (${db.type})`)
  }

  await db.loadFromSnapshot()

  if (argv.progress && argv.output !== 'json')
    process.stdout.write('\n')

  if (db)
    logger.debug(`Database '${db.path}' loaded (type: ${db.type}, entries: ${db._index._index ? Object.keys(db._index._index).length : 0})`)

  return db
}

module.exports = openDatabase
