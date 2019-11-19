/** @format */

import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express'

import knex from '../../db'

async function getUser(id: number) {
    try {
        const [note] = await knex
            .from('Users')
            .where({ id })
            .select(
                'id',
                'username',
                'numberOfNotes',
                'role',
                'firstname as firstName',
                'lastname as lastName',
                '_created',
            )
        return note
    } catch (err) {
        console.error(err)
        return new Error('Error querying database')
    }
}

export const querys = {
    Query: {
        async note(root: any, { id }: { id: string }) {
            try {
                const [note] = await knex('Notes')
                    .where({ id })
                    .select()
                return note
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
        },
        notes(root: any, { ids }: { ids: number[] }) {
            try {
                if (ids) {
                    return knex('Notes')
                        .whereIn('id', ids)
                        .select()
                }
                return knex('Notes').select()
            } catch (err) {
                console.error(err)
                return new Error('Error querying database')
            }
        },
        user: (root: any, { id }: IUser) => getUser(id),
        thisUser(root: any, args: any, { user }: { user: IUser }) {
            if (!user) {
                return new AuthenticationError('User not logged in')
            }
            return getUser(user.id)
        },
        async draft(root: any, { id }: IDraft, { user }: { user: IUser }) {
            try {
                const [draft] = await knex('Drafts')
                    .where({ id })
                    .select()
                if (!draft) {
                    return new UserInputError('Unable to find draft')
                } else if (draft.user_id !== user.id && user.role !== 'admin') {
                    return new ForbiddenError('Insufficent permissions')
                }
                return draft
            } catch (err) {
                console.error(err)
                return Error('Error querying database')
            }
        },
        async drafts(root: any, _: any, { user }: { user: IUser }) {
            try {
                const drafts = await knex('Drafts')
                    .where({ user_id: user.id })
                    .select()
                return drafts.map(({ id, note_id, posx, posy, content, user_id }) => ({
                    id,
                    noteId: note_id,
                    content,
                    userId: user_id,
                    offset: { x: posx, y: posy },
                }))
            } catch (err) {
                console.error(err)
                return Error('Error querying database')
            }
        },
    },
    User: {
        fullName: (root: IUser) => root.firstName + (root.lastName ? ' ' + root.lastName : ''),
        async numberOfNotes(root: IUser) {
            return (await knex('Notes')
                .where('userid', root.id)
                .count())[0]['count(*)']
        },
    },
    Note: {
        offset: (root: any) => ({ x: root.posx, y: root.posy }),
        user: (root: INote) => getUser(root.userid),
    },
    Draft: {
        noteId: (root: any) => root.noteId || root.note_id || null,
        offset: (root: any) => root.offset || { x: root.posx, y: root.posy } || null,
        userId: (root: any) => root.userId || root.user_id || null,
    },
}
