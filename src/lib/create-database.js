'use strict'

const path = require('path')
const startIpfs = require('../start-ipfs.js')
const config = require('../config')
const OrbitDB = require('orbit-db')

const createDatabase = async (database, type, argv) => {
  // TODO: add database path config: { repo: path.join('./.orbitdb') }
  const ipfs = await startIpfs(config.ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  // We need to pass the IPFS ID since we're not starting IPFS
  const orbitdb = new OrbitDB(ipfs, { peerId: peerId })
  const directory = process.env.ORBITDB_PATH || config.defaultDatabaseDir
  const db = await orbitdb.create(database, type, directory, {
    indexBy: argv.indexBy,
    replicate: false,
  })
  await db.saveSnapshot()
  return db
}

module.exports = createDatabase
