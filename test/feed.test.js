'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const multihash = require('multihashes')
const OrbitDB = require('orbit-db')
const CID = require('cids')
const multibase = require('multibase')
const CLI = require('./cli')

describe('OrbitDB CLI - Feed Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    id = getId()
    const result = CLI(`create ${dbname} feed`)
    databaseAddress = result.toString().replace('\n', '')
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${databaseAddress} yes`)
  })

  it('adds an event', () => {
    const result = CLI(`add ${databaseAddress} "hello 1"`)
    const cidHash = result.toString().replace('\n', '').replace('Added ', '')
    assert.strictEqual(CID.isCID(new CID(cidHash)), true)
    assert.strictEqual(multibase.isEncoded(cidHash), 'base58btc')
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
