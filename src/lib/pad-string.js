'use strict'

const assert = require('assert')

const generateString = (char = '', length = 0) => {
  let res = ''
  for (let i = 0; i < length; i ++) {
    res += char
  }
  return res
}

const padString = (input, length, moreString, padChar, padLeft = false) => {
  input = input ? input.toString() : ''
  let res = []
  const chars = input.length > length && moreString
    ? input.substring(0, length - (moreString ? moreString.length : 0)).split('').concat([moreString])
    : input.substring(0, length).split('')

  res = chars

  if (res.join('').length < length) {
    const padding = generateString(padChar ? padChar : ' ', length - res.length).split('')
    res = padLeft ? padding.concat(res) : res.concat(padding)
  }
  return res.join('')
}

/* Test */
const str1 = generateString()
const str2 = generateString('-', 10)
const str3 = generateString(' ', 32)
assert.equal(str1, '')
assert.equal(str2, '----------')
assert.equal(str3, '                                ')

const res1 = padString('1234567890', 4)
const res2 = padString('1234567890', 8, '...')
const res3 = padString('1234567890', 6, null)
const res4 = padString('1234567890', 4, '-')
const res5 = padString('1234567890', 1, '...')
const res6 = padString('1234567890', 9, '...(7)')
const res7 = padString('1234567890', 11)
const res8 = padString('1234567890', 20)
const res9 = padString('1234567890', 20, null, null, true)
const res10 = padString('1234567890', 20, null, '.')
assert.equal(res1,  '1234')
assert.equal(res2,  '12345...')
assert.equal(res3,  '123456')
assert.equal(res4,  '123-')
assert.equal(res5,  '...')
assert.equal(res6,  '123...(7)')
assert.equal(res7,  '1234567890 ')
assert.equal(res8,  '1234567890          ')
assert.equal(res9,  '          1234567890')
assert.equal(res10, '1234567890..........')

module.exports = padString
