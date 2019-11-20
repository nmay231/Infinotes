/** @format */

import knextion from '.'

export const getNote = (id: number) =>
    knextion('Notes')
        .where({ id })
        .select<[DB.Note]>()

export const getNotes = (ids?: number[]) => {
    const query = knextion('Notes').select<DB.Note[]>()
    return ids ? query.whereIn('id', ids) : query
}

export const getNotesByUser = (user_id: number) =>
    knextion('Notes')
        .where({ user_id })
        .select<DB.Note[]>()
