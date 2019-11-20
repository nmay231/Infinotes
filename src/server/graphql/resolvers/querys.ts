/** @format */

import {
    QueryResolvers,
    UserResolvers,
    NoteResolvers,
    DraftResolvers,
} from '../../../graphql-types/types'

import knextion, { getUser, getNote, getDraft, getDraftsByUser } from '../../db'
import {
    normalizeNote,
    normalizeDraft,
    normalizeUser,
    checkExists,
    checkOwnerOrAdmin,
    checkLoggedIn,
} from '../../db/normalizers'

export const User: UserResolvers = {
    fullName: (root) => root.firstName + ' ' + root.lastName,
    numberOfNotes: (root) =>
        knextion('Notes')
            .where('user_id', root.id)
            .count<number>()
            .then((count) => count[0]['count(*)']),
}
export const Note: NoteResolvers = {
    user: (root) => normalizeUser(getUser(root.id).then(checkExists)),
}
export const Draft: DraftResolvers = {
    note: (root) =>
        (<DB.Draft>(<any>root)).note_id
            ? normalizeNote(getNote((<any>root).note_id).then(checkExists))
            : null,
    user: (root) => normalizeUser(getUser((<any>root).user_id).then(checkExists)),
}

export const Query: QueryResolvers = {
    note: (_, { id }) => normalizeNote(getNote(id).then(checkExists)),
    notes: (_, { ids }) => ids.map((id) => normalizeNote(getNote(id).then(checkExists))),
    user: (_, { id }) => normalizeUser(getUser(id).then(checkExists)),
    thisUser: (_, __, { user }) => checkExists(user && normalizeUser(getUser(user.id.toString()))),
    draft: (_, { id }, { user }) =>
        normalizeDraft(getDraft(id))
            .then(checkExists)
            .then(checkLoggedIn(user))
            .then(checkOwnerOrAdmin(user)),
    drafts: (_, __, { user }) =>
        getDraftsByUser(user.id.toString())
            .then(checkLoggedIn(user))
            .then((drafts) => drafts.map((draft) => normalizeDraft(draft))),
}
