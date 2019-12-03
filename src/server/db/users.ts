/** @format */

import knextion from '.'

export const getUser = (id: string) => {
    try {
        return knextion('Users')
            .where({ id })
            .select<[DB.User]>()
            .then((userList) => userList[0])
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getUserByUsername = (username: string) => {
    try {
        return knextion('Users')
            .where({ username })
            .select<[DB.User]>()
            .then((userList) => userList[0])
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

// For future reference
const getUsers = (ids?: string[]) => {
    try {
        const query = knextion('Users').select<DB.User[]>()
        return ids ? query.whereIn('id', ids) : query
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

// Also might need this...
const searchForUser = (terms: string[]) => {}
