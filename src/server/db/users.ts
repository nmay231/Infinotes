/** @format */

import knextion from '.'

export const getUser = (id: number) =>
    knextion('Users')
        .where({ id })
        .select<[DB.User]>()

export const getUserByUsername = (username: string) =>
    knextion('Users')
        .where({ username })
        .select<[DB.User]>()

// For future reference
const getUsers = (ids?: number[]) => {
    const query = knextion('Users').select<DB.User[]>()
    return ids ? query.whereIn('id', ids) : query
}

// Might need this...
const searchForUser = (terms: string[]) => {}
