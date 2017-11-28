'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const multihash = require('multihashes')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - Eventlog Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    id = getId()
    const result = CLI(`create ${dbname} eventlog`)
    databaseAddress = result.toString().replace('\n', '')
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${databaseAddress} yes`)
  })

  it('adds an event', () => {
    const result = CLI(`add ${databaseAddress} "hello 1"`)
    const mh = multihash.fromB58String(result.toString().replace('\n', '').replace('Added ', ''))
    assert.equal(multihash.validate(mh), undefined)
  })

  it('returns events', () => {
    const result = CLI(`get ${databaseAddress}`)
    assert.equal(result.toString().replace('\n', ''), '"hello 1"')
  })

  it('doesn\'t support deleting events', (done) => {
    let hash = CLI(`add ${databaseAddress} "hello"`)
    hash = hash.toString().replace('\n', '')

    let err
    try {
      CLI(`del ${databaseAddress} ${hash}`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: Database type 'eventlog' doesn't support removing entries.`)
    setTimeout(() => done(), 2000)
  })
})
