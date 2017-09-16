'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - KeyValue Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    CLI(`create ${dbname} keyvalue`)
    id = getId()
    databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${databaseAddress} yes`)
  })

  it('sets a value', () => {
    const result = CLI(`set ${databaseAddress} id hello`)
    assert.equal(result.toString().includes('\'id\' set to \'hello\''), true)
  })

  it('returns a value for a key', () => {
    const result = CLI(`get ${databaseAddress} id`)
    assert.equal(result.toString(), 'hello\n')
  })

  it('updates a value', () => {
    const result = CLI(`set ${databaseAddress} id hello2`)
    assert.equal(result.toString().includes('\'id\' set to \'hello2\''), true)
  })

  it('doesn\'t return a value for unknown a key', () => {
    const result = CLI(`get ${databaseAddress} nokey`)
    assert.equal(result.toString(), 'No value set to key \'nokey\'\n')
  })

})
