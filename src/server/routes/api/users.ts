/** @format */

import { Router } from 'express'
import knextion from '../../db'

const router = Router()

router.get('/:id/username', async (req, res) => {
    let id = req.params.id
    if (!id) {
        return res.status(422).json('Invalid id')
    }

    try {
        const [{ username }] = await knextion('Users')
            .where({ id })
            .select()
        if (!username) {
            return res.status(422).json('Invalid id')
        }
        res.status(200).json({ username })
    } catch (err) {
        console.error(err)
        res.status(500).json('Internal server error')
    }
})

export default router
