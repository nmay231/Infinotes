/** @format */
import knextion from '.'

export const getTokenByUserId = (user_id: number) =>
    knextion('Tokens')
        .where({ user_id })
        .select<[DB.Token]>()
