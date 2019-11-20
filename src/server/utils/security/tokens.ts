/** @format */

import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

import knextion from '../../db'
// tokens(id, user_id, token, expires, _created)

export const CreateToken = async (payload: IPayload) => {
    let [tokenid] = await knextion('Tokens').insert<number[]>({ user_id: payload.user_id })
    payload.tokenid = tokenid
    payload.unique = crypto.randomBytes(32).toString('hex')
    payload.expires = moment(Date.now())
        .add(7, 'days')
        .toDate()
    let token = jwt.sign(payload, process.env.AUTH_SECRET)
    await knextion('Tokens')
        .update({ token, expires: payload.expires })
        .where({ user_id: payload.user_id })
    return token
}

export const RecoverToken = async (user_id: number) => {
    let tokenRow: { token: string; expires: Date }
    try {
        ;[tokenRow] = await knextion('Tokens')
            .where({ user_id })
            .select<{ token: string; expires: Date }[]>()
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
    let [tokenid] = await knextion('Tokens')
        .where({ id: payload.tokenid })
        .select<number[]>()
    if (!tokenid) {
        return false
    } else {
        return payload
    }
}
