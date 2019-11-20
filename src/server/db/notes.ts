/** @format */

import knextion from '.'

export const getNote = (id: string) => {
    try {
        return knextion('Notes')
            .where({ id })
            .select<[DB.Note]>()
            .then((noteList) => noteList[0])
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getNotes = (ids?: string[]) => {
    try {
        let query = knextion('Notes').select<DB.Note[]>()
        return ids ? query.whereIn('id', ids) : query
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getNotesByUser = (user_id: string) => {
    try {
        knextion('Notes')
            .where({ user_id })
            .select<DB.Note[]>()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}
