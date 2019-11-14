/** @format */

import { querys } from './querys'
import { mutations } from './mutations'
import { scalars } from './scalars'

const resolvers = {
    ...querys,
    ...mutations,
    ...scalars,
}

export default resolvers
