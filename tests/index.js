import test from 'ava'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import GraphQLSamordningsnummer from '../dist'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      samordningsnummer: {
        type: GraphQLString,
        args: {
          item: { type: GraphQLSamordningsnummer }
        },
        resolve: (root, {item}) => {
          return item
        }
      }
    }
  })
})

test('Rejects invalid formatted samordningsnummer', async t => {
  const invalid = [
    7010632391,
    '19701063-2391',
    '7010632391',
    '701063-2392', // Wrong check digit
    '',
    null,
    'wow'
  ]

  t.plan(invalid.length)

  await Promise.all(invalid.map(item => {
    const query = '{samordningsnummer(item: "' + item + '")}'
    return graphql(schema, query)
      .then(result => {
        if (result.errors) {
          t.pass()
        } else {
          t.fail('invalid samordningsnummer recognized as valid: ' + item)
        }
      })
      .catch(error => {
        t.fail(error)
      })
  }))
})

test('Accepts valid samordningsnummer', async t => {
  const valid = [
    '701063-2391'
  ]

  t.plan(valid.length)

  await Promise.all(valid.map(item => {
    const query = '{samordningsnummer(item: "' + item + '")}'
    return graphql(schema, query)
      .then(result => {
        if (result.data && result.data.samordningsnummer && !result.errors) {
          t.is(result.data.samordningsnummer, item, 'valid samordningsnummer was accepted')
        } else {
          t.fail('valid samordningsnummer recognized as invalid: ' + item)
        }
      })
      .catch(error => {
        t.fail(error)
      })
  }))
})
