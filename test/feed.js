
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - Feed Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  const contains = (str, match) => str.indexOf(match) > -1

  before(() => {
    // Make sure we don't have an existing database
    CLI(`drop ${dbname} yes`)
    CLI(`create ${dbname} feed`)
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${dbname} yes`)
  })

  it('adds an event', () => {
    const result = CLI(`add ${dbname} "hello 1"`)
    assert.equal(result.toString().length, 47)
    assert.equal(contains(result.toString(), 'Qm'), true)
  })

  it('returns events', () => {
    const result = CLI(`get ${dbname} id`)
    assert.equal(contains(result.toString(), '"hash": "Qm'), true)
    assert.equal(contains(result.toString(), '"payload": '), true)
    assert.equal(contains(result.toString(), '"next": '), true)
    assert.equal(contains(result.toString(), '"id": '), true)
    assert.equal(contains(result.toString(), '"v": '), true)
    assert.equal(contains(result.toString(), '"clock": '), true)
  })

  it('deletes an event', () => {
    let hash = CLI(`add ${dbname} "hello"`)
    hash = hash.toString().replace('\n', '')
    const result = CLI(`del ${dbname} ${hash}`)
    assert.equal(contains(result.toString(), `Deleted`), true)
  })

})
