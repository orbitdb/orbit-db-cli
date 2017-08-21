'use strict'

const path = require('path')
const IPFS = require('ipfs')

const startIpfs = (config) => {
  return new Promise((resolve, reject) => {
    const ipfs = new IPFS({
      start: false,
      repo: path.join('./', '/test', '/test-ipfs-data'),
      EXPERIMENTAL: {
        pubsub: true,        
      }
    })
    ipfs.on('error', reject)
    ipfs.on('ready', () => resolve(ipfs))
  })
}

module.exports = startIpfs
