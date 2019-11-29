/** @format */

import knextion from '.'

import { Note } from '../../graphql/resolvers'

export const getNote = async (id: Unresolved<string>) => {
    id = await Promise.resolve(id)
    try {
        const [noteList] = await knextion<DB.Note>('Notes')
            .where({ id })
            .select<[DB.Note]>()
        return noteList
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getNotes = async (ids?: string[]) => {
    try {
        let query = knextion<DB.Note>('Notes').select<DB.Note[]>()
        return await (ids ? query.whereIn('id', ids) : query)
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getNotesByUser = async (user_id: string) => {
    try {
        return await knextion<DB.Note>('Notes')
            .where({ user_id })
            .select<DB.Note[]>()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const addNote = async (
    user_id: string,
    { content, offset }: Pick<Note, 'content' | 'offset'>,
) => {
    try {
        const [note_id] = await knextion<DB.Note>('Notes').insert<[number]>({
            content,
            posx: offset.x,
            posy: offset.y,
            user_id,
        })
        return note_id.toString()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const editNote = async (
    id: string,
    { content, offset }: Partial<Pick<Note, 'content' | 'offset'>>,
) => {
    try {
        await knextion<DB.Note>('Notes')
            .where({ id })
            .update({
                content,
                posx: offset && offset.x,
                posy: offset && offset.y,
            })
        return id
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const deleteNote = async (id: string) => {
    try {
        const note = await getNote(id)
        await knextion('Notes')
            .where({ id })
            .delete()
        return note
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}
