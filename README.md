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
  create <database> <type>           Create a new database. Type can be one of:
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
  set <database> <key> <value>       Set a value of a key in KeyValue database

Options:
  -h, --help  Show help                                                  [boolean]
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

             Peer-to-Peer Database
       https://github.com/orbitdb/orbit-db

> node "src/bin.js" put /orbitdb/demo "{\"_id\":1,\"name\":\"FRANK!\"}" --indexBy name
Added document 'FRANK!'

> node "src/bin.js" get /orbitdb/demo "FRANK!" --progress
Loading database '/orbitdb/demo' ████████████████████████████████████████████████ 1/1 | 100.0% | 00:00:00
Searching for 'FRANK!' from '/orbitdb/demo'
┌────────────────────────────────────────────────────────────────┬───┐
│name                                                            │_id│
├────────────────────────────────────────────────────────────────┼───┤
│FRANK!                                                          │1  │
└────────────────────────────────────────────────────────────────┴───┘
Found 1 matches (0 ms)

> node "src/bin.js" drop /orbitdb/demo yes
Dropped database '/orbitdb/demo'

Demo finished!
```

## Dev

*Random notes*

```
node src/bin.js import 2017.csv /t9 src/schemas/csv-schema1.js --progress --limit 5000 --indexBy name
```
