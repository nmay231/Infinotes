/** @format */

import { Router } from 'express'

import { HashPassword } from '../../utils/security/passwords'
import { CreateToken } from '../../utils/security/tokens'
import knextion from '../../db'
// Users(id, username, role, hash, firstName, lastName, numberOfNotes, _created)

const router = Router()

router.post('/', async (req, res) => {
    try {
        let {
            username,
            firstName,
            lastName,
            password,
        }: { username: string; firstName: string; lastName: string; password: string } = req.body

        let hash = HashPassword(password)
        let [userid] = await knextion('Users').insert<[number]>({
            username,
            hash,
            firstName,
            lastName,
            role: 'user',
            numberOfNotes: 0,
        })
        let token = await CreateToken({ userid })
        res.status(200).json({ userid, firstName, lastName, role: 'guest', token })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

export default router
