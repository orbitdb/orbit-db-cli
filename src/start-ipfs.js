'use strict'

const IPFS = require('ipfs')
const IpfsApi = require('ipfs-api')
const IPFSRepo = require('ipfs-repo')
const DatastoreLevel = require('datastore-level')

const repoConf = {
  storageBackends: {
    blocks: DatastoreLevel,
  },
}

const startIpfs = (config = {}, argv) => {
  return new Promise((resolve, reject) => {
    config = Object.assign({}, config, { repo: new IPFSRepo(config.repo, repoConf) })
    if (argv.ipfsApiEndpoint) {
      if (typeof argv.ipfsApiEndpoint == 'string')
        var [ipfsHost, ipfsPort] = argv.ipfsApiEndpoint.split(':')
      else
        /* FIXME:
         we shud get the default from yargs when only "--ipfs-api-endpoint"
         was provided, but since yargs is returning "true" as provided value,
         I haven't found a way to reach the real default. */
        var [ipfsHost, ipfsPort] = ["localhost", "5001"]
      const ipfs = IpfsApi(ipfsHost, ipfsPort)
      resolve(ipfs)
    }
    else {
      const ipfs = new IPFS(config)
      ipfs.on('error', reject)
      ipfs.on('ready', () => resolve(ipfs))
    }
  })
}

module.exports = startIpfs
