/** @format */

import * as passport from 'passport'
import './bearerstrategy'
import './localstrategy'
import knextion from '../db'

passport.serializeUser((user: DB.User, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
    let [user] = await knextion<DB.User>('Users')
        .where({ id })
        .select()
    done(null, user)
})
