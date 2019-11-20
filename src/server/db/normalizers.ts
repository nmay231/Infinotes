/** @format */

import { ForbiddenError, AuthenticationError } from 'apollo-server-express'

import { Note, Draft, User } from '../../graphql-types/types'

export const checkExists = <T = any>(obj: T) => {
    if (!obj) {
        throw new Error('Object not found in database')
    }
    return obj
}

export const checkLoggedIn = (user: IUser) => <T = any>(obj: T) => {
    if (!user) {
        throw new AuthenticationError('User not logged in')
    }
    return obj
}

export const checkOwnerOrAdmin = (user: IUser) => <T = any>(obj: T) => {
    if ((<any>obj).user_id !== user.id && user.role !== 'admin') {
        throw new ForbiddenError('Insufficient Permissions')
    }
    return obj
}

export const normalizeUser = (user: DB.User | Promise<DB.User>) =>
    Promise.resolve(user).then((user) => ({
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
    })) as Promise<User>

export const normalizeNote = (note: DB.Note | Promise<DB.Note>) =>
    Promise.resolve(note).then((note) => ({
        ...note,
        id: note.id.toString(),
        offset: { x: note.posx, y: note.posy },
    })) as Promise<Note>

export const normalizeDraft = (draft: DB.Draft | Promise<DB.Draft>) =>
    Promise.resolve(draft).then((draft) => ({
        ...draft,
        id: draft.id.toString(),
        offset: { x: draft.posx, y: draft.posy },
    })) as Promise<Draft>
