/** @format */

import { Query, Draft, Note, User } from './querys'
import { Mutation } from './mutations'
import { scalars } from './scalars'
import { Resolvers } from '../../../graphql/resolvers'

const resolvers: Resolvers = {
    Query,
    Draft,
    Note,
    User,
    Mutation,
    ...scalars,
}

export default resolvers
