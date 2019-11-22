/** @format */

import { ForbiddenError, AuthenticationError } from 'apollo-server-express'

import { Note, Draft, User } from '../../schema/graphql'

export const checkExists = async <T = any>(obj: Unresolved<T>) => {
    obj = await Promise.resolve(obj)
    if (!obj) {
        throw new Error('Object not found in database')
    }
    return obj
}

export const checkLoggedIn = (user: User | DB.User) => {
    if (!user) {
        throw new AuthenticationError('User not logged in')
    }
    return <T = any>(obj?: Unresolved<T>) => Promise.resolve(obj)
}

export const checkOwnerOrAdmin = (user: User | DB.User) => {
    checkLoggedIn(user)
    return async <T extends Unresolved<{ user_id: string } | { user: { id: string } }> = any>(
        obj: T,
    ) => {
        const resolved = await Promise.resolve(obj)
        const user_id =
            (<{ user_id: string }>resolved).user_id || (<{ user: { id: string } }>resolved).user.id
        if (user_id !== user.id && user.role !== 'admin') {
            throw new ForbiddenError('Insufficient Permissions')
        }
        return obj
    }
}

export const normalizeUser = (user: Unresolved<DB.User>) =>
    Promise.resolve(user).then((user) => ({
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
    })) as Promise<User>

export const normalizeNote = (note: Unresolved<DB.Note>) =>
    Promise.resolve(note).then((note) => ({
        ...note,
        id: note.id.toString(),
        offset: { x: note.posx, y: note.posy },
    })) as Promise<Note>

export const normalizeDraft = (draft: Unresolved<DB.Draft>) =>
    Promise.resolve(draft).then((draft) => ({
        ...draft,
        id: draft.id.toString(),
        offset: { x: draft.posx, y: draft.posy },
    })) as Promise<Draft>
