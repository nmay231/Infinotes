/** @format */

import knextion from '.'

export const getDraft = (id: string) => {
    try {
        return knextion('Drafts')
            .where({ id })
            .select<[DB.Draft]>()
            .then((draftList) => draftList[0])
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getDrafts = (ids?: string[]) => {
    try {
        let query = knextion('Drafts').select<DB.Draft[]>()
        return ids ? query.whereIn('id', ids) : query
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}

export const getDraftsByUser = (user_id: string) => {
    try {
        return knextion('Drafts')
            .where({ user_id })
            .select<DB.Draft[]>()
    } catch (err) {
        console.error(err)
        throw new Error('Error querying database')
    }
}
