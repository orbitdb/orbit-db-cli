
'use strict'

const assert = require('assert')
const multihash = require('multihashes')
const CLI = require('./cli')

describe('OrbitDB CLI - Eventlog Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  before(() => {
    // Make sure we don't have an existing database
    CLI(`drop ${dbname} yes`)
    CLI(`create ${dbname} eventlog`)
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${dbname} yes`)
  })

  it('adds an event', () => {
    const result = CLI(`add ${dbname} "hello 1"`)
    const mh = multihash.fromB58String(result.toString().replace('\n', ''))
    assert.equal(multihash.validate(mh), undefined)
  })

  it('returns events', () => {
    const result = CLI(`get ${dbname} id`)
    assert.equal(result.toString().includes('"hash": "Qm'), true)
    assert.equal(result.toString().includes('"payload": '), true)
    assert.equal(result.toString().includes('"next": '), true)
    assert.equal(result.toString().includes('"id": '), true)
    assert.equal(result.toString().includes('"v": '), true)
    assert.equal(result.toString().includes('"clock": '), true)
  })

  it('doesn\'t support deleting events', () => {
    let hash = CLI(`add ${dbname} "hello"`)
    hash = hash.toString().replace('\n', '')

    let err
    try {
      CLI(`del ${dbname} ${hash}`)
    } catch (e) {
      err = e.toString().split('\n')[1]
    }
    assert.equal(err, `Error: Database type 'eventlog' doesn't support removing entries.`)
  })
})
