/** @format */

import { Query, Draft, Note, User } from './querys'
import { Mutation } from './mutations'
import { scalars } from './scalars'
import { Resolvers } from '../../../graphql-types/types'

const resolvers: Resolvers = {
    Query,
    Draft,
    Note,
    User,
    Mutation,
    ...scalars,
}

export default resolvers
