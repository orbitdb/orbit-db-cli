'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const multihash = require('multihashes')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - Feed Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    CLI(`create ${dbname} feed`)
    id = getId()
    databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
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
    const result = CLI(`get ${databaseAddress} id`)
    assert.equal(result.toString().replace('\n', ''), '"hello 1"')
  })

  it('deletes an event', () => {
    let hash = CLI(`add ${databaseAddress} "hello"`)
    hash = hash.toString().replace('\n', '')
    const result = CLI(`del ${databaseAddress} ${hash}`)
    assert.equal(result.toString().includes('Deleted'), true)
  })

})
