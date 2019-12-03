/** @format */

import knextion from '.'

export const getTokenByUserId = async (user_id: number) => {
    const [token] = await knextion<DB.Token>('Tokens')
        .where({ user_id })
        .select()
    return token
}
