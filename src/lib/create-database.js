'use strict'

const startIpfs = require('../start-ipfs.js')
const config = require('../config')
const OrbitDB = require('orbit-db')

const createDatabase = async (database, type, argv) => {
  // TODO: add database path config: { repo: path.join('./.orbitdb') }
  const ipfs = await startIpfs(config.ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  const orbitdb = new OrbitDB(ipfs, peerId)
  const directory = config.defaultDatabaseDir
  const db = await orbitdb.create(database, type, directory, peerId, {
    indexBy: argv.indexBy,
    replicate: false,
  })
  await db.saveSnapshot()
  return db
}

module.exports = createDatabase
