import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import luhn from 'fast-luhn'

const yearRe = '(?:19|20)\\d{2}'
const monthRe = '(?:0[1-9]|1[0-2])'
const dayRe = '(?:6[1-9]|7\\d|9[0-1])'
const randomNoRe = '\\d{4}'

const samordningsnummerRegex = new RegExp(`^${yearRe}${monthRe}${dayRe}-${randomNoRe}$`)

function validateSamordningsnummer (val) {
  if (!samordningsnummerRegex.test(val)) {
    throw new Error('Samordningsnummer has the wrong format')
  }

  if (!luhn(val.substr(2).replace('-', ''))) {
    throw new Error('Samordningsnummer has the wrong check-digit')
  }
}

const GraphQLSamordningsnummer = new GraphQLScalarType({
  name: 'Samordningsnummer',
  description: 'Swedish samordningsnummer, defined by Skatteverket. Eg. "701063-2391".',
  serialize: value => {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Samordningsnummer cannot represent non string type ${JSON.stringify(value)}`
      )
    }
    validateSamordningsnummer(value)

    return value
  },
  parseValue: value => {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Samordningsnummer cannot represent non string type ${JSON.stringify(value)}`
      )
    }
    validateSamordningsnummer(value)

    return value
  },
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `Samordningsnummer cannot represent non string type ${String(ast.value != null ? ast.value : null)}`
      )
    }
    validateSamordningsnummer(ast.value)

    return ast.value
  }
})

export default GraphQLSamordningsnummer
