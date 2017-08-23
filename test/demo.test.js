
'use strict'

const assert = require('assert')
const rmrf = require('rimraf')
const CLI = require('./cli')

describe('OrbitDB CLI - Demo', function () {
  this.timeout(50000)

  let result

  before(() => {
    // Make sure we don't have an existing database
    rmrf.sync('./orbitdb')
    const command = `demo Tester`
    CLI('id')
    result = CLI(command)
    result = result.toString()
  })

  it('runs the demo', () => {
    assert.equal(result.includes('Demo finished!'), true)
  })

  it('displays progress bar', () => {
    assert.equal(result.includes(`████████████████████████████████████████ 1/1 | 100.0%`), true)
  })

  it('finds the added entry', () => {
    assert.equal(result.includes('Found 1 matches'), true)
  })

  it('displays the logo', () => {
    assert.equal(result.includes('\\___/|_|  |_.__/|_|\\__|  \\__,_|_.__/'), true)
    assert.equal(result.includes('Peer-to-Peer Database'), true)
    assert.equal(result.includes('https://github.com/orbitdb/orbit-db'), true)
  })

})
