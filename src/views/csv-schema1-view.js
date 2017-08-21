'use strict'

const utils = require('../lib/utils')
const categories = require('./category-mappings.json')

module.exports = () => {
  return [
    { name: 'name' },
    { name: 'hash', desc: 'Hash' },
    { name: 'added' },
    { name: 'size', rightAlign: true, transform: e => e && e > -1 ? utils.getHumanReadableBytes(e) : 'unknown' },
    { name: 'category', transform: e => categories[e] || '' },
  ]
  // Mapping for the same data but as an array
  // return [
  //   { name: '2' },
  //   { name: '1', desc: 'Hash' },
  //   { name: '0' },
  //   { name: '3', rightAlign: true, transform: e => e && e > -1 ? utils.getHumanReadableBytes(e) : 'unknown' },
  //   { name: '4', transform: e => categories[e] || '' },
  // ]
}
