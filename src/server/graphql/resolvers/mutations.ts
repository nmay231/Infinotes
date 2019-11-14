/** @format */
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express'

import knex from '../../db'

export const mutations = {
    Mutation: {
        async addNote(
            root: any,
            { content, offset }: Pick<INote, 'content' | 'offset'>,
            { user }: { user: IUser },
        ) {
            if (!user) {
                throw new AuthenticationError('User not logged in')
            }
            try {
                const [id] = await knex('Notes').insert({
                    content,
                    posx: offset.x,
                    posy: offset.y,
                    userid: user.id,
                })
                const [note] = await knex('Notes')
                    .where({ id })
                    .select()
                return note
            } catch (err) {
                console.error(err)
                throw new Error('Error querying database')
            }
        },
        async editNote(
            root: any,
            { id, content, offset }: Pick<INote, 'id' | 'content' | 'offset'>,
            { user }: { user: IUser },
        ): Promise<INote> {
            let note: INote
            try {
                ;[note] = await knex('Notes')
                    .where({ id })
                    .select()
            } catch (err) {
                console.error(err)
                throw new Error('Error querying database')
            }
            if (!note) {
                throw new UserInputError(`Note not found with id ${id}`)
            } else if (!user || (note.userid !== user.id && user.role !== 'admin')) {
                throw new ForbiddenError('Unauthorized action')
            }
            await knex('Notes')
                .where({ id })
                .update({
                    content,
                    posx: offset && offset.x,
                    posy: offset && offset.y,
                })
            return { ...note, content, offset }
        },
        async deleteNote(root: any, { id }: { id: Pick<INote, 'id'> }, { user }: { user: IUser }) {
            let note: INote
            try {
                ;[note] = await knex('Notes')
                    .where({ id })
                    .select()
            } catch (err) {
                console.error(err)
                throw new Error('Error querying database')
            }
            if (note && note.userid !== user.id) {
                throw new ForbiddenError('Unauthorized action')
            }
        },
    },
}
