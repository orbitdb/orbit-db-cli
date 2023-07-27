const path = require("path");

const defaultOrbitDbDir = './orbitdb';

export const repoPath = process.env.IPFS_PATH || path.join(defaultOrbitDbDir, '/ipfs');

const conf = {
  // silent: true,
  start: false,
  config: {
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Gateway: '/ip4/0.0.0.0/tcp/0',
      Swarm: [
        '/ip4/0.0.0.0/tcp/0',
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
      ],
    },
    Bootstrap: [],
    Discovery: {
      MDNS: {
        Enabled: true,
        Interval: 1,
      },
    },
    Pubsub: {
      Enabled: true,
    },
  },
  libp2p: {
    nat: {
      enabled: false,
    },
  },
}

export const defaultDatabaseDir = defaultOrbitDbDir;
export const ipfsConfig = conf;