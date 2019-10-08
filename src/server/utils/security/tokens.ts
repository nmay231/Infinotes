/** @format */

import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

import knextion from '../../db'
// tokens(id, userid, token, expires, _created)

export const CreateToken = async (payload: IPayload) => {
    let [tokenid] = await knextion('Tokens').insert<number[]>({ userid: payload.userid })
    payload.tokenid = tokenid
    payload.unique = crypto.randomBytes(32).toString('hex')
    payload.expires = moment(Date.now())
        .add(7, 'days')
        .toDate()
    let token = jwt.sign(payload, process.env.AUTH_SECRET)
    await knextion('Tokens')
        .update({ token, expires: payload.expires })
        .where({ userid: payload.userid })
    return token
}

export const RecoverToken = async (userid: number) => {
    let tokenRow: { token: string; expires: Date }
    try {
        ;[tokenRow] = await knextion('Tokens')
            .where({ userid })
            .select<{ token: string; expires: Date }[]>()
    } catch (err) {
        return false
    }
    if (!tokenRow || moment(tokenRow.expires).isBefore(Date.now())) {
        await knextion('Tokens')
            .where({ userid })
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
