
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - KeyValue Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  before(() => {
    // Make sure we don't have an existing database
    CLI(`drop ${dbname} yes`)
  })

  after(() => {
    // Drop the test database
    CLI(`drop ${dbname} yes`)
  })

  it('sets a value', () => {
    const result = CLI(`set ${dbname} id hello`)
    assert.equal(result.toString().includes('\'id\' set to \'hello\''), true)
  })

  it('returns a value for a key', () => {
    const result = CLI(`get ${dbname} id`)
    assert.equal(result.toString(), 'hello\n')
  })

  it('updates a value', () => {
    const result = CLI(`set ${dbname} id hello2`)
    assert.equal(result.toString().includes('\'id\' set to \'hello2\''), true)
  })

  it('doesn\'t return a value for unknown a key', () => {
    const result = CLI(`get ${dbname} nokey`)
    assert.equal(result.toString(), 'No value set to key \'nokey\'\n')
  })

})
