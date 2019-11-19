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
                return new AuthenticationError('User not logged in')
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
                return new Error('Error querying database')
            }
        },
        async editNote(
            root: any,
            { id, content, offset }: Pick<INote, 'id' | 'content' | 'offset'>,
            { user }: { user: IUser },
        ) {
            let note: INote
            try {
                ;[note] = await knex('Notes')
                    .where({ id })
                    .select()
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
            if (!note) {
                return new UserInputError(`Note not found with id ${id}`)
            } else if (!user || (note.userid !== user.id && user.role !== 'admin')) {
                return new ForbiddenError('Unauthorized action')
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
                return new Error('Error querying database')
            }
            if (!note) {
                return
            } else if (note.userid !== user.id && user.role !== 'admin') {
                return new ForbiddenError('Unauthorized action')
            }
            await knex('Notes')
                .where({ id })
                .delete()
            return note
        },
        async newDraft(root: any, { content, offset }: IDraft, { user }: { user: IUser }) {
            if (!user) {
                return new AuthenticationError('User not logged in')
            }
            try {
                const [id] = await knex('Drafts').insert({
                    content,
                    posx: offset.x,
                    posy: offset.y,
                    user_id: user.id,
                })
                return {
                    ...(await knex('Drafts')
                        .where({ id })
                        .select())[0],
                }
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
        },
        async noteToDraft(root: any, { noteId }: IDraft, { user }: { user: IUser }) {
            if (!user) {
                return new AuthenticationError('User not logged in')
            }
            try {
                const query = knex('Notes')
                    .where({ id: noteId })
                    .select('content', 'posx', 'posy')
                const [note] = await (user.role === 'admin'
                    ? query
                    : query.where({ userid: user.id }))

                if (!note) {
                    return new Error(`note id "${noteId}" not found`)
                }

                const { content, posx, posy } = note
                const [id] = await knex('Drafts').insert({
                    note_id: noteId,
                    content,
                    posx,
                    posy,
                    user_id: user.id,
                })

                return { id, noteId, content, posx, posy, userId: user.id }
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
        },
        async updateDraft(
            root: any,
            { id, content, offset }: IDraft & { id: number },
            { user }: { user: IUser },
        ) {
            if (!user) {
                return new AuthenticationError('User not logged in')
            }
            try {
                const [{ user_id }] = await knex('Drafts')
                    .where({ id })
                    .select('user_id')
                if (user.id !== user_id && user.role !== 'admin') {
                    return new ForbiddenError('Insignificant permissions')
                }
                await knex('Drafts')
                    .where({ id })
                    .update({ content, posx: offset && offset.x, posy: offset && offset.y })
                return (await knex('Drafts')
                    .where({ id })
                    .select())[0]
            } catch (err) {
                console.error(err)
                return Error('Error querying database')
            }
        },
        async deleteDraft(
            root: any,
            { id, saveToNote }: { id: number; saveToNote: boolean },
            { user }: { user: IUser },
        ) {
            if (!user) {
                return new AuthenticationError('User not logged in')
            }
            let draft: IDraft
            try {
                ;[draft] = await knex('Drafts')
                    .where({ id })
                    .select()
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
            if (!draft) {
                return
            } else if ((draft as any).user_id !== user.id && user.role !== 'admin') {
                return new ForbiddenError('Unauthorized action')
            }
            let noteId: IDraft['noteId']
            if (saveToNote) {
                const { note_id, content, posx, posy } = draft as any
                if (note_id !== null) {
                    noteId = note_id
                    await knex('Notes')
                        .where({ id: note_id })
                        .update({ content, posx, posy })
                } else {
                    ;[noteId] = await knex('Notes').insert({ content, posx, posy, userid: user.id })
                }
            }
            await knex('Drafts')
                .where({ id })
                .delete()
            return { ...draft, noteId }
        },
    },
}
