/** @format */

import * as passport from 'passport'
import './bearerstrategy'
import './localstrategy'
import knextion from '../db'

passport.serializeUser((user: IUser, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
    let user = await knextion('Users')
        .where({ id })
        .select<IUser>()
    done(null, user)
})
