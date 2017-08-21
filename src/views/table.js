'use strict'

const padString = require('../lib/pad-string')

/*
  Output:
  ["┌───────────┬───────────┐\n",
   "│field1     │fieldN     │\n",
   "├───────────┼───────────┤\n",
   "│row1.field1│row1.fieldn│"]
   "└───────────┴───────────┘"]
 */

const fill = (char, width) => padString('', width, null, char)

const resultObjectToString = (e, fields, maxWidth) => {
  const res = fields.map((f) => {
    const value = f.transform ? f.transform(e[f.name]) : (typeof e !== 'string' ? e[f.name] : e)
    return `│${padString(value, f.width, '...', '', f.rightAlign === true)}`
  })
  return res.join('') + '│'
}

const getFieldWidth = (res, fieldName, desc, transform) => {
  transform = transform ? transform : e => e
  return res.map(e => e[fieldName])
    .map(transform)
    .concat([fieldName, desc])
    .reduce((res, val) => Math.max(res, val ? val.toString().length : 0), 0)
}

const table = (tableDescription, data, options) => {
  let top    = '┌'
  let texts  = '' 
  let middle = '├'
  let result = ''
  let bottom = '└'

  const maxWidth = (options.maxWidth ? options.maxWidth : 70)

  const fieldKeys = Array.isArray(data[0]) 
    ? data[0].map((e, idx) => idx.toString()) 
    : (typeof data[0] === "object" ? Object.keys(data[0]) : ['undefined'])

  let sorted = fieldKeys
    .map((e) => {
      const i = tableDescription.findIndex(f => f.name === e)
      return { name: e, index: i !== -1 ? i : (typeof data[0] === "object" ? Object.keys(data[0]).length : 0) }
    })
    .sort((a, b) => a.index - b.index)
    .map(e => e.name)

  let fields = sorted
    .map((f, idx) => {
      const fieldDesc = tableDescription.find(e => e.name === f)
      const transform = fieldDesc ? fieldDesc.transform : null
      const desc = fieldDesc ? fieldDesc.desc : null
      let cell = { 
        name: f,
        desc: desc,
        width: idx === 0 ? 0 : getFieldWidth(data, f, desc, transform),
        rightAlign: fieldDesc ? fieldDesc.rightAlign : false,
        transform: transform,
      }
      return cell
    })

  // Calculate field widths
  fields = fields
    .map((f, idx) => {
      f.width = idx === 0
          ? maxWidth - fields.reduce((res, val) => res + val.width, 0) - (fields.length + 1)
          : f.width
      return f    
    })

  fields.forEach((f, idx) => {
    const name = f.desc ? f.desc : f.name
    top += (idx === 0 ? '' : '┬') + fill('─', f.width)
    texts += f.rightAlign
      ? `│${fill(' ', f.width - name.length)}${name}` 
      : `│${padString(name, f.width, '...', ' ')}`
    middle += (idx === 0 ? '' : '┼') + fill('─', f.width)
    bottom += (idx === 0 ? '' : '┴') + fill('─', f.width)
  })
  top    += '┐\n'
  texts  += '│\n'
  middle += '┤\n'
  bottom += '┘'

  const rows = data.map(e => resultObjectToString(e, fields, maxWidth))
  result += rows.join('\n') + (rows.length > 0 ? '\n' : '')

  return [top, texts, middle, result, bottom].join('')
}

module.exports = table
