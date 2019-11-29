/** @format */

import { MutationResolvers } from '../../../graphql/resolvers'

import {
    getNote,
    getDraft,
    addNote,
    editNote,
    deleteNote,
    addDraft,
    addDraftFromNote,
    editDraft,
} from '../../db'
import {
    checkLoggedIn,
    normalizeNote,
    checkOwnerOrAdmin,
    normalizeDraft,
    checkExists,
} from '../../db/normalizers'
import { deleteDraft } from '../../db/drafts'

export const Mutation: MutationResolvers = {
    addNote: (_, { content, offset }, { user }) => {
        checkLoggedIn(user)
        return normalizeNote(getNote(addNote(user.id, { content, offset })))
    },
    updateNote: (_, { id, content, offset }, { user }) => {
        checkOwnerOrAdmin(user)(getNote(id))
        return normalizeNote(getNote(editNote(id, { content, offset })))
    },
    deleteNote: (_, { id }, { user }) => {
        checkOwnerOrAdmin(user)(getNote(id))
        return normalizeNote(deleteNote(id))
    },
    addDraft: (_, { content, offset }, { user }) => {
        checkLoggedIn(user)
        return normalizeDraft(getDraft(addDraft(user.id, { content, offset })))
    },
    noteToDraft: (_, { noteId }, { user }) => {
        const note = getNote(noteId)
        checkOwnerOrAdmin(user)(note)
        return normalizeDraft(getDraft(addDraftFromNote(note)))
    },
    updateDraft: (_, { id, content, offset }, { user }) => {
        checkOwnerOrAdmin(user)(getDraft(id))
        return normalizeDraft(getDraft(editDraft(id, { content, offset })))
    },
    deleteDraft: async (_, { id }, { user }) => {
        let draft = await checkOwnerOrAdmin(user)(checkExists(getDraft(id)))
        await deleteDraft(id)
        return normalizeDraft(draft)
    },
}
