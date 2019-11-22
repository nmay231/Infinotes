/** @format */

import {
    QueryResolvers,
    UserResolvers,
    NoteResolvers,
    DraftResolvers,
    Draft as IDraft,
} from '../../../schema/graphql'

import knextion, {
    getUser,
    getNote,
    getDraft,
    getDraftsByUser,
    getNotes,
    getNotesByUser,
} from '../../db'
import {
    normalizeNote,
    normalizeDraft,
    normalizeUser,
    checkExists,
    checkOwnerOrAdmin,
    checkLoggedIn,
} from '../../db/normalizers'

export const User: UserResolvers = {
    fullName: (user) => user.firstName + ' ' + user.lastName,
    numberOfNotes: (user) =>
        knextion<DB.Note>('Notes')
            .where('user_id', user.id)
            .count<[{ count: number }]>('* as count')
            .then((count) => count[0].count),
    notes: (user) =>
        getNotesByUser(user.id).then((notes) => notes.map((note) => normalizeNote(note))),
}
export const Note: NoteResolvers = {
    user: (note) => normalizeUser(getUser((<DB.Note>(<any>note)).user_id).then(checkExists)),
}
export const Draft: DraftResolvers = {
    note: (draft) =>
        (<DB.Draft>(<any>draft)).note_id
            ? normalizeNote(getNote((<any>draft).note_id).then(checkExists))
            : null,
    user: (draft) => normalizeUser(getUser((<any>draft).user_id).then(checkExists)),
}

export const Query: QueryResolvers = {
    note: (_, { id }) => normalizeNote(getNote(id).then(checkExists)),
    notes: (_, { ids }) =>
        ids
            ? ids.map((id) => normalizeNote(getNote(id).then(checkExists)))
            : getNotes().then((notes) => notes.map((note) => normalizeNote(note))),
    user: (_, { id }) => normalizeUser(getUser(id).then(checkExists)),
    thisUser: (_, __, { user }) => checkLoggedIn(user)(normalizeUser(getUser(user.id.toString()))),
    draft: (_, { id }, { user }) =>
        checkOwnerOrAdmin(user)(normalizeDraft(checkExists(getDraft(id)))),
    drafts: (_, __, { user }) =>
        checkLoggedIn(user)(
            getDraftsByUser(user.id.toString()).then((drafts) =>
                drafts.map((draft) => normalizeDraft(draft)),
            ),
        ),
}
