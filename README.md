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

        Serverless peer-to-peer Database
    Website: https://github.com/orbitdb/orbit-db

Usage: src/bin.js <command> <database>

Commands:
  create <database> <type>      Create a new database             [aliases: new]
  del <database> <key>          Delete an entry from a database. Only valid for:
                                docstore, keyvalue and feed.
  demo <name>                   Runs a sequence of commands as an example
  drop <database> yes           Remove a database locally. This does not remove
                                data on other nodes that have the removed
                                database replicated.
  get <database> [<search>]     Query the database              [aliases: query]
  inc <database> [<value>]      Increase the value of a counter database
                                                             [aliases: increase]
  info <database>               Show information about a database
                                                               [aliases: status]
  put <database> <document>     Add a document to a document database
  set <database> <key> <value>  Set a value of a key in KeyValue database

Options:
  -h, --help  Show help                                                [boolean]
```

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

        Serverless peer-to-peer Database
    Website: https://github.com/orbitdb/orbit-db

> node "src/bin.js" put /orbitdb/demo "{\"_id\":1,\"name\":\"FRANK\"}" --indexBy name
Index as 'FRANK' (name) to '/orbitdb/demo'
Added QmXPeAA8ciCLN8h3Gghij8PAE3zwV1kWrFpXzs7qAARywA (35 ms)

> node "src/bin.js" get /orbitdb/demo "FRANK" --progress
Loading database '/orbitdb/demo' ████████████████████████████████████████████████ 1/1 | 100.0% | 00:00:00
Searching for 'FRANK' from '/orbitdb/demo'
┌────────────────────────────────────────────────────────────────┬───┐
│name                                                            │_id│
├────────────────────────────────────────────────────────────────┼───┤
│FRANK                                                           │1  │
└────────────────────────────────────────────────────────────────┴───┘
Found 1 matches (0 ms)

> node "src/bin.js" drop /orbitdb/demo yes
Dropped database '/orbitdb/demo'

Demo finished!
```
