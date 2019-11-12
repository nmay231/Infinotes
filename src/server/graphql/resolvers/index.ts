/** @format */

import { GraphQLDateTime } from 'graphql-iso-date'

const resolvers = {
    Query: {
        hello() {
            return 'Hello World!'
        },
        note(root: any, { id }: { id: string }) {
            return {
                id,
                content: 'yo',
                offset: { x: 1, y: 2 },
            }
        },
        notes(root: any, { ids }: { ids: number[] }) {
            return ids.map((id) => ({
                id,
                content: 'yo',
                offset: { x: 1, y: 2 },
            }))
        },
    },
    DateTime: GraphQLDateTime,
}

export default resolvers
