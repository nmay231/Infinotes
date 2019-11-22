/** @format */

import { Router } from 'express'

import { HashPassword } from '../../utils/security/passwords'
import { CreateToken } from '../../utils/security/tokens'
import knextion from '../../db'
// Users(id, username, role, hash, first_name, last_name, numberOfNotes, _created)

const router = Router()

router.post('/', async (req, res) => {
    try {
        let {
            username,
            first_name,
            last_name,
            password,
        }: { username: string; first_name: string; last_name: string; password: string } = req.body

        let hash = HashPassword(password)
        let [user_id] = await knextion<DB.User>('Users').insert<[string]>({
            username,
            hash,
            first_name,
            last_name,
            role: 'user',
        })
        let token = await CreateToken({ user_id })

        const response: IToken = {
            user_id,
            firstName: first_name,
            lastName: last_name,
            role: 'guest',
            token,
        }
        res.status(200).json(response)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
