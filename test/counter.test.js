'use strict'

const path = require('path')
const assert = require('assert')
const rmrf = require('rimraf')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - Counter Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')
  const getCounterValue = (address) => parseInt(CLI(`get ${address}`).toString())
  const getCounterValueJson = (address) => CLI(`get ${address} --output json`).toString().replace('\n', '')
  const contains = (str, match) => str.indexOf(match) > -1

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    id = getId()
    // databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
    const result = CLI(`create ${dbname} counter`)
    databaseAddress = result.toString().replace('\n', '')
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${databaseAddress} yes`)
  })

  it('returns the counter value', () => {
    assert.equal(getCounterValue(databaseAddress), 0)
  })

  it('returns the counter value as JSON', () => {
    assert.equal(getCounterValueJson(databaseAddress), JSON.stringify({ value: 0 }))
  })

  it('increases a counter by 1', () => {
    CLI(`inc ${databaseAddress}`)
    assert.equal(getCounterValue(databaseAddress), 1)
  })

  it('increases a counter by 33', () => {
    CLI(`increase ${databaseAddress} 33`)
    assert.equal(getCounterValue(databaseAddress), 34)
  })

  it('is persisted', () => {
    assert.equal(getCounterValue(databaseAddress), 34)
  })

  it('can\'t decrease the counter', () => {
    let err
    try {
      CLI(`increase ${databaseAddress} -33`)
    } catch (e) {
      err = e.toString()
    }
    assert.equal(contains(err, 'Invalid input value -33. Input must be greater than 0.'), true)
    assert.equal(getCounterValue(databaseAddress), 34)
  })

})
