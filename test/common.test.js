
'use strict'

const path = require('path')
const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - Common', function () {
  this.timeout(20000)

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

  it('errors if database doesn\'t exist', () => {
    let err
    try {
      CLI(`info ${dbname}`)
    } catch (e) {
      err = e.toString()
    }
    assert.equal(contains(err, 'Database \'/testdb\' doesn\'t exist.'), true)
  })

  it('creates a database', () => {
    const type = 'counter'
    const result1 = CLI(`create ${dbname} ${type}`)
    const result2 = CLI(`info ${dbname}`)
    const id = result2.toString().split('\n').find(e => e.indexOf('Owner:') > -1).split(': ')[1]
    const expected = path.join('/orbitdb', id, dbname)
    assert.equal(contains(result1.toString(), expected), true)
  })

  it('shows database info', () => {
    const result = CLI(`info ${dbname}`)
    assert.equal(contains(result.toString(), 'Owner:'), true)
    assert.equal(contains(result.toString(), `Name: ${dbname}`), true)
    assert.equal(contains(result.toString(), `Type: counter`), true)
  })

  it('needs a confirmation to drop a database', () => {
    let err
    try {
      const result1 = CLI(`drop ${dbname} no`)
    } catch (e) {
      err = e.toString()
    }
      assert.equal(contains(err, `Can't drop the database. Confirm with: 'yes'`), true)
  })

  it('drops a database', () => {
    const result1 = CLI(`drop ${dbname} yes`)
    assert.equal(contains(result1.toString(), `Dropped database '${dbname}'`), true)

    let err
    try {
      CLI(`info ${dbname}`)
    } catch (e) {
      err = e.toString()
    }
    assert.equal(contains(err, `Database '${dbname}' doesn't exist.`), true)
  })

})
