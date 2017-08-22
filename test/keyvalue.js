
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - KeyValue Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  const contains = (str, match) => str.indexOf(match) > -1

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
    assert.equal(contains(result.toString(), '\'id\' set to \'hello\''), true)
  })

  it('returns a value for a key', () => {
    const result = CLI(`get ${dbname} id`)
    assert.equal(result.toString(), 'hello\n')
  })

})
