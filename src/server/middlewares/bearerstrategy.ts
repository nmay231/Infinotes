/** @format */

import * as passport from 'passport'
import * as BearerStrategy from 'passport-http-bearer'

import knextion from '../db'
import { ValidateToken } from '../utils/security/tokens'

passport.use(
    new BearerStrategy.Strategy(async (token, done) => {
        try {
            let payload = await ValidateToken(token)
            if (!payload) {
                return done(null, false)
            }
            let [user] = await knextion<DB.User>('Users')
                .where({ id: payload.user_id })
                .select()
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        } catch (err) {
            console.error(err)
            return done(err)
        }
    }),
)
