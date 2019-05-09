# orbitdb - CLI for orbit-db

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby)
[![CircleCI](https://circleci.com/gh/orbitdb/orbit-db-cli.svg?style=shield)](https://circleci.com/gh/orbitdb/orbit-db-cli)
[![npm version](https://badge.fury.io/js/orbit-db-cli.svg)](https://www.npmjs.com/package/orbit-db-cli)
[![node](https://img.shields.io/node/v/orbit-db-cli.svg)](https://www.npmjs.com/package/orbit-db-cli)

> CLI for orbit-db

A CLI tool to manage [orbit-db](https://github.com/orbitdb/orbit-db) databases.

<a href="https://asciinema.org/a/JdTmmdBCZarkBkPqbueicwMrG" target="_blank"><img src="https://asciinema.org/a/JdTmmdBCZarkBkPqbueicwMrG.png" width="50%"/></a>

## Table of Contents

- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Install](#install)
- [Run](#run)
	- [Data Directories and Paths](#data-directories-and-paths)
- [Demo](#demo)
- [Replicate](#replicate)
	- [For `eventlog` or `feed` type databases](#for-eventlog-or-feed-type-databases)
	- [For `docstore` type databases](#for-docstore-type-databases)
- [Dev](#dev)
- [License](#license)

## Quick Start

```
$ orbitdb create hello feed
/orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello

$ orbitdb add /orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello "world"
Added QmSwYZheHVa3eWf83XwnWNJtjGG7EWjiWTaTKLeFozVRnz

$ orbitdb get /orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello
"world"

$ orbitdb del /orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello QmSwYZheHVa3eWf83XwnWNJtjGG7EWjiWTaTKLeFozVRnz
Deleted QmSwYZheHVa3eWf83XwnWNJtjGG7EWjiWTaTKLeFozVRnz

$ orbitdb get /orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello
Database '/orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello' is empty!

$ orbitdb info /orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello
/orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello
> Type: feed
> Owner: QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1
> Data file: ./orbitdb/QmfSUsdr34iGio68eMezDzZLCKZTnbsxNJgiNipimZtpi1/hello.orbitdb
> Entries: 0
> Oplog length: 2 / 2
> Write-access:
> 04986b1db63cdbe0798699da5054477cfda4ec32dc62563b0c77a94ec8ed8e1946c1cfad0e8c2a681ded54f66dc1614cb0dcfac5b04f1fab3d09ca368f0ff0097f
```

## Requirements

* [Node.js](https://nodejs.org) >= [**v10.0.0**](https://nodejs.org/en/download/current/)
* npm

## Install
From npm:

```
npm install -g orbit-db-cli
```

From Git:

```
git clone https://github.com/orbitdb/orbit-db-cli.git
cd orbit-db-cli/
npm install
```

## Run

```
orbitdb
```

*When installed from Git, the CLI can be run with `node ./src/bin`*

For complete guide on usage, see the CLI help:

```
orbitdb help
```

Output:

```
                 _     _ _         _ _
                | |   (_) |       | | |
       ___  _ __| |__  _| |_    __| | |__
      / _ \| '__| '_ \| | __|  / _` | '_ \
     | (_) | |  | |_) | | |_  | (_| | |_) |
      \___/|_|  |_.__/|_|\__|  \__,_|_.__/

             Peer-to-Peer Database
       https://github.com/orbitdb/orbit-db


Usage: orbitdb <command> <database>

Commands:
  add <database> [<data>]            Add an entry to an eventlog or feed
                                     database. Can be only used on:
                                     eventlog|feed
  create <database> <type>           Create a new database. Type can be one of:
                                     eventlog|feed|docstore|keyvalue|counter
                                                                  [aliases: new]
  del <database> <key>               Delete an entry from a database. Only valid
                                     for data types of: docstore|keyvalue|feed
                                                       [aliases: delete, remove]
  demo <name>                        Runs a sequence of commands as an example
                                                                 [aliases: tour]
  drop <database> yes                Remove a database locally. This doesn't
                                     remove data on other nodes that have the
                                     removed database replicated.
                                                              [aliases: destroy]
  get <database> [<search>]          Query the database.
                                                        [aliases: query, search]
  id                                 Show information about current orbit-db id
  import <file> <database> <schema>  Import a CSV file to a document database
                                                                  [aliases: csv]
  inc <database> [<increment>]       Increase the value of a counter database.
                                     Default increment is 1. [aliases: increase]
  info <database>                    Show information about a database
                                                               [aliases: status]
  put <database> <document>          Add a document to a document database
  replicate <database>               Replicate a database with peers.
  set <database> <key> <value>       Set a value of a key in KeyValue database
  version                            Show information about current orbit-db

Options:
  -h, --help  Show help                                                [boolean]
```

### Data Directories and Paths

By default, `orbit-db` creates a data directory `./orbitdb` under which metadata of databases is stored along with the actual data blocks saved in IPFS. The metadata can be found under `./orbitdb/QmFoo/database.orbitdb` for each database. The data blocks saved in IPFS are in `./orbitdb/ipfs`.

To use another `orbit-db` data directory (as opposed to the default `./orbitdb`), set `ORBITDB_PATH` environment variable to point to the desired data directory. Eg. run the CLI with `ORBITDB_PATH=/path/orbitdb orbitdb ...`

 To use `orbit-db` with an existing IPFS data repository, set the `IPFS_PATH` environment variable to the desired IPFS repository path. Eg. run the CLI with `IPFS_PATH=/path/to/ipfs orbitdb ...`

## Demo

```
node ./src/cli/bin demo FRANK!
```

Output:

```
                 _     _ _         _ _
                | |   (_) |       | | |
       ___  _ __| |__  _| |_    __| | |__
      / _ \| '__| '_ \| | __|  / _` | '_ \
     | (_) | |  | |_) | | |_  | (_| | |_) |
      \___/|_|  |_.__/|_|\__|  \__,_|_.__/

             Peer-to-Peer Database
       https://github.com/orbitdb/orbit-db

> node "src/bin.js" create /orbitdb/demo docstore
/orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo

> node "src/bin.js" put /orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo "{\"_id\":1,\"name\":\"FRANK!\"}" --indexBy name
Added document 'FRANK!'

> node "src/bin.js" get /orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo "FRANK!" --progress
Loading '/orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo'
██████████████████████████████████████████ 1/1 | 100.0% | 00:00:00
Searching for 'FRANK!' from '/orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo'
┌────────────────────────────────────────────────────────────────┬───┐
│name                                                            │_id│
├────────────────────────────────────────────────────────────────┼───┤
│FRANK!                                                          │1  │
└────────────────────────────────────────────────────────────────┴───┘
Found 1 matches (0 ms)

> node "src/bin.js" drop /orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo yes
Dropped database '/orbitdb/QmcE2HMrDTL3SFV1rcB5GaJVSJFfpFsnfTM4qK8SRScjyj/demo'

Demo finished!
```

## Replicate

### For `eventlog` or `feed` type databases

Demo:

<a href="https://asciinema.org/a/h6JaCcm3TnlMQox9pE7kRKtoR"><img src="https://asciinema.org/a/h6JaCcm3TnlMQox9pE7kRKtoR.png" width="50%"/></a>

Run in the terminal:

```
orbitdb create a eventlog
```

Copy the address the above command output. Eg. `/orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a`.

In a second terminal, run:

```
mkdir tmp/ && cd tmp/
orbitdb replicate <address> --progress
```

*Eg. `orbitdb replicate /orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a --progress --dashboard`*

Output:
```
Replicating '/orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a'
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0/0 |   0.0% | 00:00:00
```

In the first terminal, run:
```
orbitdb add <address> hi! -r --sync --interval 1000
```

Observe the database replicating to the second instance.

Output:
```
Replicating ██████████████████████████░░░░░░░░░░░░░░ 2/3 |  66.7% | 00:00:21
```

```
Replicating ████████████████████████████████████████ 77/77 |  100.0% | 00:02:31
```
### For `docstore` type databases

First, create a database and add an item to it:

```
$ node src/bin.js create /orbitdb/mydocstore docstore                         ~
/orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore
$ node src/bin.js put /orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore '{"name": "foo", "_id": 1}' --indexBy name
Added document 'foo'
```

You may now syncrhonise it with another. To do that, run `replicate` on the current directory as well as in the directory you want to synchronise with. Both should result in the same output:

```
$ node src/bin.js replicate /orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore --progress
Swarm listening on /ip4/127.0.0.1/tcp/38795/ipfs/QmRvDCjRzBB9PjkcCRJQFBDS8V8hsfivpQGFUh85ERxQeM
Swarm listening on /ip4/1.2.3.4/tcp/38795/ipfs/QmRvDCjRzBB9PjkcCRJQFBDS8V8hsfivpQGFUh85ERxQeM
Loading '/orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore' (docstore)
Loading '/orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore' ░░░ 0/1 |   0.0% | 00:00:00
████████████████████████████████████████████████████████████████████████████████████████ 1/1 | 100.0% | 00:00:00
Replicating '/orbitdb/QmapaF6FmS3JgTQBKSpSZUdqgf2t8VUUvXcUCdPd5MaeQB/orbitdb/mydocstore'
████████████████████████████████████████████████████████████████████████████████████████ 1/1 | 100.0% | 00:00:00
```

## Dev

*Random notes*

```
node src/bin.js import 2017.csv /t9 src/schemas/csv-schema1.js --progress --limit 5000 --indexBy name
```
## Contribute

We would be happy to accept PRs! If you want to work on something, it'd be good to talk beforehand to make sure nobody else is working on it. You can reach us [on Gitter](https://gitter.im/orbitdb/Lobby), or in the [issues section](https://github.com/orbitdb/orbit-db-cli/issues).

We also have **regular community calls**, which we announce in the issues in [the @orbitdb welcome repository](https://github.com/orbitdb/welcome/issues). Join us!

For specific guidelines for contributing to this repository, check out the [Contributing guide](CONTRIBUTING.md). For more on contributing to OrbitDB in general, take a look at the [@OrbitDB welcome repository](https://github.com/orbitdb/welcome). Please note that all interactions in [@OrbitDB](https://github.com/orbitdb) fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) ©️ 2017-2018 Haja Networks Oy
