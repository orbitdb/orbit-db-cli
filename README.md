# orbitdb - CLI for orbit-db

**Work in progress!**

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

Usage: src/cli/bin <command>

Commands:
  counter <command> <dbname>   Counter Database
  demo <name>                  Runs a sequence of commands as an example
  docstore <command> <dbname>  Document Database
  eventlog <command> <dbname>  Eventlog Database
  feed <command> <dbname>      Feed Database
  keyvalue <command> <dbname>  Key-Value Database

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

> node ./src/bin docstore put /orbitdb/demo "{\"_id\":1,\"name\":\"FRANK!\"}" --indexBy name
Loading database '/orbitdb/demo'

Index as 'FRANK!' (name) to '/orbitdb/demo'
Added QmdQS1bbHHitN4XsAojAXX7SxxRkTBW7QRQKbSMnuHrrU5 (34 ms)

> node ./src/bin docstore search /orbitdb/demo "FRANK!" --progress
Loading database '/orbitdb/demo' ████████████████████████████████████████████████ 1/1 | 100.0% | 00:00:00

Search for 'FRANK!' from '/orbitdb/demo'
┌────────────────────────────────────────────────────────────────┬───┐
│name                                                            │_id│
├────────────────────────────────────────────────────────────────┼───┤
│FRANK!                                                          │1  │
└────────────────────────────────────────────────────────────────┴───┘
Found 1 matches (0 ms)

> node ./src/bin docstore drop /orbitdb/demo yes
Dropped database '/orbitdb/demo'

Demo finished!
```
