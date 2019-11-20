/** @format */

import { Router } from 'express'

import { RecoverToken, CreateToken } from '../../utils/security/tokens'
import knextion, { User } from '../../db'
// Users(id, username, role, hash, first_name, last_name, numberOfNotes, _created)

const router = Router()

router.post('/', async (req, res) => {
    try {
        let { username, password }: { username: string; password: string } = req.body
        let [user] = await knextion('Users')
            .where({ username })
            .select<User[]>()
        let token = (await RecoverToken(user.id)) || (await CreateToken({ user_id: user.id }))
        res.status(200).json({
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            token,
        })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
