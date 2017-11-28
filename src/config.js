'use strict'

const path = require('path')

const defaultOrbitDbDir = './orbitdb'

const conf = {
  start: false,
  repo: process.env.IPFS_PATH || path.join(defaultOrbitDbDir, '/ipfs'),
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Swarm: [
        '/ip4/0.0.0.0/tcp/0',
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
      ],
      Gateway: '/ip4/0.0.0.0/tcp/0',
      // API: null,
      // Swarm: [],
      // Gateway: null,
    },
  },
  Discovery: {
    MDNS: {
      Enabled: true,
      Interval: 10,
    },
    webRTCStar: {
      Enabled: false,
    }
  },
}

module.exports = {
  defaultDatabaseDir: defaultOrbitDbDir,
  ipfsConfig: conf,
}
