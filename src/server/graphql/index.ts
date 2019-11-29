/** @format */

import { ApolloServer } from 'apollo-server-express'

import { importSchema } from 'graphql-import'
import resolvers from './resolvers'

export const graphqlServer = new ApolloServer({
    typeDefs: importSchema('src/graphql/schema.graphql'),
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
