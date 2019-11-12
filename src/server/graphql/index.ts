/** @format */

import { ApolloServer } from 'apollo-server-express'

import typeDefs from './types'
import resolvers from './resolvers'

export const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
})
