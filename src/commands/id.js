'use strict'

const config = require('../config')
const startIpfs = require('../start-ipfs.js')

/* Export as Yargs command */
exports.command = 'id'
exports.aliases = []
exports.desc = 'Show information about current orbit-db id'

exports.builder = (yargs) => {
  return yargs
    .usage(`Usage: $0 id`)
}

exports.handler = async (argv) => {
  const startTime = new Date().getTime()
  const ipfsConfig = Object.assign({}, config.ipfsConfig)
  const ipfs = await startIpfs(ipfsConfig)
  const peerId = await ipfs.config.get('Identity.PeerID')
  process.stdout.write(`${peerId}\n`)
  process.exit(0)
}
