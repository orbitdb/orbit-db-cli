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
  let ipfsConfig = Object.assign({}, config.ipfsConfig)

  if (argv.address) {
    ipfsConfig.start = true
  }

  const ipfs = await startIpfs(ipfsConfig, argv)
  const peerId = await ipfs.config.get('Identity.PeerID')
  process.stdout.write(`${peerId}\n`)

  if (argv.address) {
    process.stdout.write(`${ipfs._peerInfo.multiaddrs._multiaddrs[0].toString()}\n`)
  }
  process.exit(0)
}
