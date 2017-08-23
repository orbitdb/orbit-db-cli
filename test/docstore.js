
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - Document Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  before(() => {
    // Make sure we don't have an existing database
    CLI(`drop ${dbname} yes`)
    CLI(`create ${dbname} docstore`)
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${dbname} yes`)
  })

  it('adds a document', () => {
    const jsonDoc = JSON.stringify({ hello: "world", _id: 1 }).split('"').join('\\"')
    const result = CLI(`put ${dbname} "${jsonDoc}"`)
    assert.equal(result.toString(), `Added document '1'\n`)
  })

  it('throws an error when the provided document doesn\'t contain field \'_id\'', () => {
    let err
    try {
      CLI(`put ${dbname} "${JSON.stringify({ hello: "world" }).split('"').join('\\"')}"`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, 'Error: The provided document doesn\'t contain field \'_id\'')
  })

  it('returns a document', () => {
    const result = CLI(`get ${dbname}`)
    assert.equal(result.toString().includes('Found 1 matches'), true)
    assert.equal(result.toString().includes('hello'), true)
    assert.equal(result.toString().includes('world'), true)
  })

  it('output is rendered nicely in a table', () => {
    const result = CLI(`get ${dbname}`)
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
    CLI(`drop ${dbname} yes`)
    const jsonDoc = JSON.stringify({ hello: "world" }).split('"').join('\\"')
    let hash = CLI(`put ${dbname} "${jsonDoc}" --indexBy hello`)
    hash = hash.toString().replace('\n', '')
    const result = CLI(`del ${dbname} world`)
    assert.equal(result.toString().includes('Deleted'), true)
    const noResults = CLI(`get ${dbname}`)
    assert.equal(noResults.toString().includes(`Database '/testdb' is empty!`), true)
  })

  it('returns an error when trying to delete non-existent document', () => {
    let err
    try {
      CLI(`del ${dbname} "nokey"`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: No entry with key 'nokey' in the database`)
  })

})
