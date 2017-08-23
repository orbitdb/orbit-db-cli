'use strict'

const padString = require('./pad-string')

function getHumanReadableBytes (size) {
  if (size === 0)
    return '0 Bytes'

  var i = Math.floor( Math.log(size) / Math.log(1024) )
  return ( size / Math.pow(1024, i) ).toFixed(i > 2 ? 2 : 0) * 1 + ' ' + ['Bytes', 'kB', 'MB', 'GB', 'TB'][i]
}

const outputReplicationInfo = (db, entry, maxClock, startTime, _have, temp = true, peerCount = 0, bytesDownloaded = 0) => {
  const total = maxClock
  const maxWidth = Math.min(1000, process.stdout.columns - 2) // -2 for the table lines at the beginning and end
  const rowCount = Math.ceil(total / maxWidth)

  let grid = ''
  let final = ''
  final += '┌' + padString(null, maxWidth, '', '─') + '┐' + '\n'

  for(let i = 1; i < total + 1; i ++) {
    grid += _have[i] ? (temp ? 'O' : 'o') : '.'
  }

  let lastLineLength = 0
  for(let k = 0; k < rowCount; k ++) {
    const startPos = k * maxWidth
    final += '│' + padString(grid.slice(startPos, startPos + maxWidth), maxWidth, '', ' ')  + '│' + '\n'
  }

  final += '└' + padString(null, maxWidth, '', '─') + '┘' + '\n'

  process.stdout.write('\n')
  process.stdout.write(`${final}`)
  process.stdout.write(`Peers: ${peerCount} | Tasks running: ${db._loader._tasksRunning} | Queued: ${db._loader._queue.length} | Replicated: ${getHumanReadableBytes(bytesDownloaded)}\n`)
}

module.exports = outputReplicationInfo
