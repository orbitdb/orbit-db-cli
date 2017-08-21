
'use strict'

const assert = require('assert')
const CLI = require('./cli')

describe('OrbitDB CLI - Demo', function () {
  this.timeout(50000)

  const dbname = '/testdb'
  const contains = (str, match) => str.indexOf(match) > -1

  let result

  before(() => {
    const command = `demo Tester`
    result = CLI(command)
    result = result.toString()
  })

  it('runs the demo', () => {
    assert.equal(contains(result, 'Demo finished!'), true)
  })

  it('displays progress bar', () => {
    assert.equal(contains(result, `Loading database '/orbitdb/demo' ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0/1 |   0.0% | 00:00:00`), true)
  })

  it('adds and indexes and entrty correctly', () => {
    assert.equal(contains(result, `Index as 'Tester' (name) to '/orbitdb/demo'`), true)
  })

  it('finds the added entry', () => {
    assert.equal(contains(result, `Found 1 matches`), true)
  })

  it('displays the logo', () => {
    assert.equal(contains(result, '\\___/|_|  |_.__/|_|\\__|  \\__,_|_.__/'), true)
    assert.equal(contains(result, `Peer-to-Peer Database`), true)
    assert.equal(contains(result, `https://github.com/orbitdb/orbit-db`), true)
  })

})
