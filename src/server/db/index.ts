/** @format */

import * as knex from 'knex'

const knextion = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
})

export { getNote, getNotes, getNotesByUser, addNote, editNote, deleteNote } from './notes'
export { getTokenByUserId } from './tokens'
export { getUser, getUserByUsername } from './users'
export {
    getDraft,
    getDrafts,
    getDraftsByUser,
    addDraft,
    addDraftFromNote,
    editDraft,
} from './drafts'

export default knextion
