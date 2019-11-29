/** @format */

import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLScalarType } from 'graphql'
import { ValidationError } from 'apollo-server-express'

export const scalars = {
    Position: new GraphQLScalarType({
        name: 'Position',
        description: 'Position as coords: {x: int, y: int}',
        serialize(value: IPos) {
            if (typeof value.x !== 'number' || typeof value.y !== 'number') {
                throw new ValidationError('Position must have shape {x: number, y: number}')
            }
            return value
        },
    }),
    UserRole: new GraphQLScalarType({
        name: 'UserRole',
        description: "The user's role as string",
        serialize(role: DB.User['role']) {
            if (!(role === 'admin' || role === 'guest' || role === 'user')) {
                throw new ValidationError(`Invalid role ${role}`)
            }
            return role
        },
    }),
    DateTime: GraphQLDateTime,
}
