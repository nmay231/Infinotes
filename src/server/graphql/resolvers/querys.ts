/** @format */

import { AuthenticationError } from 'apollo-server-express'

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
        throw new Error('Error querying database')
    }
}

export const querys = {
    Query: {
        note(root: any, { id }: { id: string }) {
            return new Promise(async (resolve, reject) => {
                try {
                    const [note] = await knex('Notes')
                        .where({ id })
                        .select('id', 'content', 'posx', 'posy')
                    resolve(note)
                } catch (err) {
                    console.error(err)
                    reject('Error querying database')
                }
            })
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
                throw new Error('Error querying database')
            }
        },
        user: (root: any, { id }: { id: number }) => getUser(id),
        thisUser(root: any, args: any, { user }: { user: IUser }) {
            if (!user) {
                throw new AuthenticationError('User not logged in')
            }
            return getUser(user.id)
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
}
