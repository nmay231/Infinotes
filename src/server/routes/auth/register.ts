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
        let [user_id] = await knextion('Users').insert<[number]>({
            username,
            hash,
            first_name,
            last_name,
            role: 'user',
            numberOfNotes: 0,
        })
        let token = await CreateToken({ user_id })
        res.status(200).json({ user_id, first_name, last_name, role: 'guest', token })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
