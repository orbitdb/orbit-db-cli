'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const OrbitDB = require('orbit-db')
const CLISync = require('./cli')
const CLI = require('./cli-async')

describe('OrbitDB CLI - Replication', function () {
  this.timeout(120000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLISync(`id`).toString().replace('\n', '')

  beforeEach(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    CLISync(`create ${dbname} eventlog`)
    id = getId()
    databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
  })

  after(() => {
    rmrf.sync('./orbitdb')
  })

  it('replicates a database', (done) => {
    const numEntries = 64
    let result
    let listening = true

    const id1 = new Date().getTime() - 128

    process.env = Object.assign({}, process.env, { 
      IPFS_PATH: '/tmp/orbit-tests-' + id1,
      ORBITDB_PATH: '/tmp/orbit-tests-' + id1 + '-orbitdb',
    })

    const replicator = CLI(`replicate ${databaseAddress} --output json`)

    replicator.stdout.on('data', (data) => {
      if (!listening)
        return

      try {
        const isLater = (res, acc) => acc.max && acc.max > res.max && acc.progress && acc.progress > res.progress
        const lines = data.toString().split('\n')
        const d = lines.length > 0
          ? lines.filter(e => e !== '' && e !== '\n').map(e => e.replace(' ', ''))
          : [data.toString()]

        if (d.length === 0 || d[0].indexOf('Swarmlistening') > -1)
          return

        let entry
        try {
          entry = JSON.parse(d)
        } catch (e) {
          console.log(d)
          done(e)
        }

        // console.log("ee", entry)
        entry = entry.length > 0 ? entry.reduce(isLater, { max: 0, progress: 0 }) : entry

        if (entry.max >= numEntries && entry.progress >= numEntries) {
          listening = false
          result = entry
          replicator.kill('SIGINT')
          producer.kill('SIGINT')
        }
      } catch (e) {
        if (data.toString().indexOf('Swarm listening') > -1
            || data.toString().indexOf('Connected to peers') > -1
            || data.toString().indexOf('Saving to database') > -1
            || data.toString().indexOf('Stopping') > -1
            || data.toString() === '\n'
            || data.toString() === '') {
          return
        }

        console.log("Error:", e)
        console.log("Input data:\n", data.toString())
        replicator.kill()
        producer.kill()
      }
    })

    replicator.stderr.on('data', (data) => console.error("orbitdb-cli error:", data.toString()))

    const id2 = new Date().getTime() + 128
    const inputText = 'hi!'

    process.env = Object.assign({}, process.env, { 
      IPFS_PATH: '/tmp/orbit-tests-' + id2 ,
      ORBITDB_PATH: '/tmp/orbit-tests-' + id2 + '-orbitdb',
    })
    const producer = CLI(`add ${databaseAddress} ${inputText} --sync --replicate --interval 200`)

    replicator.on('exit', (data) => {
      const interval = setInterval(() => {
        if (producer.killed) {
          clearInterval(interval)
          process.env = Object.assign({}, process.env, { 
            IPFS_PATH: '/tmp/orbit-tests-' + id1,
            ORBITDB_PATH: '/tmp/orbit-tests-' + id1 + '-orbitdb',
          })
          const queryResult = CLISync(`get ${databaseAddress} --output json --limit 1`).toString()
          // console.log("query result:", queryResult)
          let entry
          try {
            entry = JSON.parse(queryResult)
          } catch (e) {
            console.log(queryResult)
            done(e)
          }
          assert.equal(result.id, databaseAddress)
          assert.equal(result.max >= numEntries, true)
          assert.equal(result.progress >= numEntries, true)
          assert.equal(entry.v, 0)
          assert.notEqual(entry.payload, null)
          assert.notEqual(entry.payload.value, null)
          assert.equal(entry.payload.value.includes(inputText), true)
          assert.equal(entry.payload.op, 'ADD')
          assert.equal(entry.payload.key, null)
          assert.notEqual(entry.hash, null)
          assert.notEqual(entry.id, null)
          assert.notEqual(entry.clock, null)
          assert.notEqual(entry.clock.id, null)
          assert.equal(entry.clock.time >= numEntries, true)
          done()
        } else {
          producer.kill('SIGINT')
        }
      }, 1000)
    })
  })
})
