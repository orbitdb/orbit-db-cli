'use strict'

const path = require('path')
const OrbitDB = require('orbit-db')
const config = require('../config')
const startIpfs = require('../start-ipfs.js')
const outputTimer = require('../lib/output-timer')
const exitOnError = require('../exit-on-error')

/* Export as Yargs command */
exports.command = 'key'
exports.aliases = []
exports.desc = 'Show your write key'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 key`)
}

exports.handler = async (argv) => {
  const ipfsConfig = Object.assign({}, config.ipfsConfig)
  const ipfs = await startIpfs(ipfsConfig)
  const directory = process.env.ORBITDB_PATH || config.defaultDatabaseDir
  const orbitdb = await OrbitDB.createInstance(ipfs, { directory: directory })
  process.stdout.write(`${orbitdb.key.getPublic('hex')}\n`)
  process.exit(0)
}
