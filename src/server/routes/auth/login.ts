/** @format */

import { Router } from 'express'

import { RecoverToken, CreateToken } from '../../utils/security/tokens'
import { ComparePassword } from '../../utils/security/passwords'
import knextion from '../../db'
// Users(id, username, role, hash, first_name, last_name, _created)

const router = Router()

router.post('/', async (req, res) => {
    try {
        let { username, password }: { username: string; password: string } = req.body
        let [user] = await knextion<DB.User>('Users')
            .where({ username })
            .select()
        if (!ComparePassword(password, user.hash)) {
            return res.status(401).send('Invalid login credentials')
        }
        let token = (await RecoverToken(user.id)) || (await CreateToken({ user_id: user.id }))

        const response: IToken = {
            user_id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            token,
        }
        res.status(200).json(response)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
