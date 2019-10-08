/** @format */

import { Router } from 'express'

import { RecoverToken, CreateToken } from '../../utils/security/tokens'
import knextion, { User } from '../../db'
// Users(id, username, role, hash, firstName, lastName, numberOfNotes, _created)

const router = Router()

router.post('/', async (req, res) => {
    try {
        let { username, password }: { username: string; password: string } = req.body
        let [user] = await knextion('Users')
            .where({ username })
            .select<User[]>()
        let token = (await RecoverToken(user.id)) || (await CreateToken({ userid: user.id }))
        res.status(200).json({
            userid: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token,
        })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
