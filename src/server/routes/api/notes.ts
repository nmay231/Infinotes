/** @format */

import { Router } from 'express'
import knextion from '../../db'
import { isUser, BearerStrategy } from '../../middlewares/authCheckpoints'

const router = Router()

router.use(BearerStrategy())

router.get('/:id?', async (req, res) => {
    let id = req.params.id
    try {
        if (id) {
            res.status(200).json(
                (await knextion('Notes')
                    .where({ id })
                    .select())[0],
            )
        } else {
            res.status(200).json(await knextion('Notes').select())
        }
    } catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
})

router.post('/', isUser, async (req, res) => {
    let { content, offset }: { content: string; offset: IPos } = req.body
    if (!content || !offset) {
        return res.status(422).json('Must include content and offset in body')
    }

    try {
        let [id] = await knextion('Notes').insert({
            content,
            userid: req.user.id,
            posx: offset.x,
            posy: offset.y,
        })
        res.status(200).json({ id })
    } catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }
})

router.put('/:id', isUser, async (req, res) => {
    let { content, offset }: { content: string; offset: IPos } = req.body
    let id = req.params.id
    if (!content && !offset) {
        return res.status(422).json('Must include content or offset in body')
    }

    try {
        let [note] = await knextion('Notes')
            .where({ id })
            .select<INote[]>()
        if (!note) {
            return res.status(422).json('Invalid id')
        } else if (note.userid !== req.user.id && req.user.role !== 'admin') {
            return res
                .status(401)
                .json('You do not have significant permissions to perform this action')
        }

        await knextion('Notes').update({
            content,
            posx: offset && offset.x,
            posy: offset && offset.y,
        })
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.status(500).json('Internal server error')
    }
})

router.delete('/:id', isUser, async (req, res) => {
    let id = req.params.id

    try {
        let [{ userid }] = await knextion('Notes')
            .where({ id })
            .select<INote[]>()
        if (userid !== req.user.id && req.user.role !== 'admin') {
            return res
                .status(401)
                .json('You do not have significant permissions to perform this action')
        }
        await knextion('Notes')
            .where({ id })
            .delete()
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.status(500).json('Internal server error')
    }
})

export default router
