# orbitdb - CLI for orbit-db

[![CircleCI](https://circleci.com/gh/haadcode/orbit-db-cli.svg?style=svg)](https://circleci.com/gh/haadcode/orbit-db-cli)

**Work in progress!**

## Requirements

* [Node.js](https://nodejs.org) >= [**v8.0.0**](https://nodejs.org/en/download/current/)
* npm

## Install
```
git clone https://github.com/haadcode/orbit-db-cli.git
cd orbit-db-cli/
npm install
```

## Run

```
node ./src/bin
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


Usage: src/bin.js <command> <database>

Commands:
  add <database> <event>             Add an event to an eventlog or feed
                                     database
  create <name> <type>               Create a new database. Type can be one of:
                                     eventlog|feed|docstore|keyvalue|counter
                                                                  [aliases: new]
  del <database> <key>               Delete an entry from a database. Only valid
                                     for data types of: docstore|keyvalue|feed.
                                                       [aliases: delete, remove]
  demo <name>                        Runs a sequence of commands as an example
                                                                 [aliases: tour]
  drop <database> yes                Remove a database locally. This doesn't
                                     remove data on other nodes that have the
                                     removed database replicated.
                                                              [aliases: destroy]
  get <database> [<search>]          Query the database.
                                                        [aliases: query, search]
  import <file> <database> <schema>  Import a CSV file to a document database
                                                                  [aliases: csv]
  inc <database> [<value>]           Increase the value of a counter database
                                                             [aliases: increase]
  info <database>                    Show information about a database
                                                               [aliases: status]
  put <database> <document>          Add a document to a document database
  replicate <database>               Replicate a database with peers.
  set <database> <key> <value>       Set a value of a key in KeyValue database

Options:
  -h, --help  Show help                                                  [boolean]
```

`orbit-db` will create a data directory at `./orbitdb` that contains orbitdb's local data files, keys and the data blocks of IPFS. Each database is saved under IPFS peer ID, eg. database `hello` is saved in `./orbitdb/QmchYcbnNYgJZNapnkHZTWHXJiNVgBp6T7KpoL381nUon5/hello.orbitdb`. The IPFS peer ID is used to determine the *owner* of the database.

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

Demo:

<a href="https://asciinema.org/a/h6JaCcm3TnlMQox9pE7kRKtoR"><img src="https://asciinema.org/a/h6JaCcm3TnlMQox9pE7kRKtoR.png" width="50%"/></a>

Run in the terminal:

```
node src/bin.js create a eventlog
```

Copy the address the above command output. Eg. `/orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a`.

In a second terminal, run:

```
mkdir tmp/ && cd tmp/
node ../src/bin.js replicate /<address> --progress --dashboard
```

*Eg. `node ../src/bin.js replicate /orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a --progress --dashboard`*

Output:
```
Replicating '/orbitdb/QmQxfgdjo3EQZiqBgt4uDiJNoLNedRNCZTHCquohxScsXc/a'
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0/0 |   0.0% | 00:00:00
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘
Tasks running: 0 | Queued: 0
```

In the first terminal, run:
```
node src/bin.js add /<address> hi! -r --sync --interval 1000
```

Observe the database replicating to the second instance.

Output:
```
Replicating ██████████████████████████░░░░░░░░░░░░░░ 2/3 |  66.7% | 00:00:21
┌───────────────────────────────────────────────────────────────────────────┐
│OO.                                                                        │
└───────────────────────────────────────────────────────────────────────────┘
Tasks running: 1 | Queued: 1
```

```
Replicating ████████████████████████████████████████ 77/77 |  100.0% | 00:02:31
┌─────────────────────────────────────────────────────────────────────────────┐
│OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO│
└─────────────────────────────────────────────────────────────────────────────┘
Tasks running: 0 | Queued: 0
```


## Dev

*Random notes*

```
node src/bin.js import 2017.csv /t9 src/schemas/csv-schema1.js --progress --limit 5000 --indexBy name
```
