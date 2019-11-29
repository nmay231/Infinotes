/** @format */

import knextion from '.'

import { Draft } from '../../graphql/resolvers'

export const getDraft = async (id: Unresolved<string>) => {
    try {
        id = await Promise.resolve(id)
        const [draftList] = await knextion<DB.Draft>('Drafts')
            .where({ id })
            .select()
        return draftList
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getDrafts = async (ids?: string[]) => {
    try {
        let query = knextion<DB.Draft>('Drafts').select()
        return await (ids ? query.whereIn('id', ids) : query)
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getDraftsByUser = async (user_id: string) => {
    try {
        return await knextion<DB.Draft>('Drafts')
            .where({ user_id })
            .select()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const addDraft = async (
    user_id: string,
    { content, offset }: Pick<Draft, 'content' | 'offset'>,
) => {
    try {
        const [draft_id] = await knextion<DB.Draft>('Drafts').insert<[number]>({
            user_id,
            content,
            posx: offset.x,
            posy: offset.y,
        })
        return draft_id.toString()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const addDraftFromNote = async (
    note: Unresolved<Pick<DB.Note, 'id' | 'content' | 'posx' | 'posy' | 'user_id'>>,
) => {
    const { id: note_id, content, posx, posy, user_id } = await Promise.resolve(note)
    try {
        const [draft_id] = await knextion<DB.Draft>('Drafts').insert<[number]>({
            note_id,
            user_id,
            content,
            posx,
            posy,
        })
        return draft_id.toString()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const editDraft = async (
    id: string,
    { content, offset }: Partial<Pick<Draft, 'content' | 'offset'>>,
) => {
    try {
        await knextion<DB.Draft>('Drafts')
            .where({ id })
            .update({
                content,
                posx: offset && offset.x,
                posy: offset && offset.y,
            })
        return id
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const deleteDraft = async (id: string) => {
    try {
        await knextion<DB.Draft>('Drafts')
            .where({ id })
            .delete()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}
