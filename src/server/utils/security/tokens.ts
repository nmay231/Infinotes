/** @format */

import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

import knextion from '../../db'
// tokens(id, user_id, token, expires, _created)

export const CreateToken = async (payload: IPayload) => {
    let [token_id] = await knextion<DB.Token>('Tokens').insert<[string]>({
        user_id: payload.user_id,
    })
    payload.token_id = token_id
    payload.unique = crypto.randomBytes(32).toString('hex')
    payload.expires = moment(Date.now())
        .add(7, 'days')
        .toDate()
    let token = jwt.sign(payload, process.env.AUTH_SECRET)
    await knextion<DB.Token>('Tokens')
        .update({ token, expires: payload.expires })
        .where({ user_id: payload.user_id })
    return token
}

export const RecoverToken = async (user_id: string) => {
    let tokenRow: DB.Token
    try {
        ;[tokenRow] = await knextion<DB.Token>('Tokens')
            .where({ user_id })
            .select()
    } catch (err) {
        return false
    }
    if (!tokenRow || moment(tokenRow.expires).isBefore(Date.now())) {
        await knextion('Tokens')
            .where({ user_id })
            .delete()
        return false
    }

    return tokenRow.token
}

export const ValidateToken = async (token: string) => {
    let payload: IPayload = <IPayload>jwt.decode(token)
    if (!payload) {
        return false
    }
    let token_id: string
    try {
        ;[token_id] = await knextion('Tokens')
            .where({ id: payload.token_id })
            .select<[string]>()
    } catch (err) {
        return false
    }
    if (!token_id) {
        return false
    } else {
        return payload
    }
}
