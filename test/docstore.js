
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe.skip('OrbitDB CLI - Document Database', function () {
  this.timeout(5000)

  const dbname = '/testdb'

  const checkValueCommand = `docstore get ${dbname}`
  const getCounterValue = () => parseInt(CLI(checkValueCommand).toString())
  const contains = (str, match) => str.indexOf(match) > -1

  before(() => {
    // Make sure we don't have an existing database
    CLI(`counter drop ${dbname} yes`)
  })

  after(() => {
    // Drop the test database
    CLI(`counter drop ${dbname} yes`)
  })

  it('returns the counter value', () => {
    assert.equal(getCounterValue(), 0)
  })

  it('increases a counter by 1', () => {
    CLI(`counter increase ${dbname} 1`)
    assert.equal(getCounterValue(), 1)
  })

  it('increases a counter by 33', () => {
    CLI(`counter increase ${dbname} 33`)
    assert.equal(getCounterValue(), 34)
  })

  it('is persisted', () => {
    assert.equal(getCounterValue(), 34)
  })

  it('can\'t decrease the counter', () => {
    CLI(`counter increase ${dbname} -33`)
    assert.equal(getCounterValue(), 34)
  })

  it('drops the database', () => {
    const result1 = CLI(`counter drop ${dbname} yes`)
    assert.equal(contains(result1, `Dropped database '${dbname}'`), true)
    assert.equal(getCounterValue(), 0)
  })
})
