'use strict'

const path = require('path')
const rmrf = require('rimraf')
const assert = require('assert')
const OrbitDB = require('orbit-db')
const CLI = require('./cli')

describe('OrbitDB CLI - Document Database', function () {
  this.timeout(20000)

  let id, databaseAddress
  const dbname = '/testdb'
  const getId = () => CLI(`id`).toString().replace('\n', '')

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    CLI(`create ${dbname} docstore`)
    id = getId()
    databaseAddress = OrbitDB.parseAddress(path.join('/', id, dbname))
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${databaseAddress} yes`)
  })

  it('adds a document', () => {
    const jsonDoc = JSON.stringify({ hello: 'world', _id: 1 }).split('"').join('\\"')
    const result = CLI(`put ${databaseAddress} "${jsonDoc}"`)
    assert.equal(result.toString(), `Added document '1'\n`)
  })

  it('throws an error when the provided document doesn\'t contain field \'_id\'', () => {
    let err
    try {
      CLI(`put ${databaseAddress} "${JSON.stringify({ hello: 'world' }).split('"').join('\\"')}"`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, 'Error: The provided document doesn\'t contain field \'_id\'')
  })

  it('returns a document', () => {
    const result = CLI(`get ${databaseAddress}`)
    assert.equal(result.toString().includes('Found 1 matches'), true)
    assert.equal(result.toString().includes('hello'), true)
    assert.equal(result.toString().includes('world'), true)
  })

  it('output is rendered nicely in a table', () => {
    const result = CLI(`get ${databaseAddress}`)
    assert.equal(result.toString().includes('─'), true)
    assert.equal(result.toString().includes('│'), true)
    assert.equal(result.toString().includes('┌'), true)
    assert.equal(result.toString().includes('└'), true)
    assert.equal(result.toString().includes('┐'), true)
    assert.equal(result.toString().includes('┘'), true)
    assert.equal(result.toString().includes('├'), true)
    assert.equal(result.toString().includes('┤'), true)
  })

  it('deletes a document', () => {
    CLI(`drop ${databaseAddress} yes`)
    CLI(`create ${dbname} docstore`)
    const jsonDoc = JSON.stringify({ hello: 'world' }).split('"').join('\\"')
    let hash = CLI(`put ${databaseAddress} "${jsonDoc}" --indexBy hello`)
    hash = hash.toString().replace('\n', '')
    const result = CLI(`del ${databaseAddress} world`)
    assert.equal(result.toString().includes('Deleted'), true)
    const noResults = CLI(`get ${databaseAddress}`)
    console.log(noResults.toString(), databaseAddress)
    assert.equal(noResults.toString().includes(`Database '${databaseAddress}' is empty!`), true)
  })

  it('returns an error when trying to delete non-existent document', () => {
    let err
    try {
      CLI(`del ${databaseAddress} "nokey"`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: No entry with key 'nokey' in the database`)
  })

})
