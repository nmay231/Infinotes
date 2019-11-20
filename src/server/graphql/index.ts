/** @format */

import { ApolloServer } from 'apollo-server-express'

import typeDefs from './schema.gql'
import resolvers from './resolvers'

export const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError(err) {
        // Remove stacktrace in production
        if (process.env.NODE_ENV === 'production') {
            err.extensions.exception = undefined
        }
        return err
    },
    context({ req }) {
        return {
            user: req.user || null,
        }
    },
})
