/** @format */

import { Router } from 'express'

import { isUser, BearerStrategy } from '../../middlewares/authCheckpoints'
import knextion from '../../db'

const router = Router()

router.use(BearerStrategy())

router.get('/:id?', async (req, res) => {
    let id = req.params.id
    try {
        let query = knextion('Notes').select()
        let result = await (id ? query.where({ id }) : query)
        result = result.map((note) => {
            note.offset = { x: note.posx, y: note.posy }
            delete note.posx, note.posy
            return note
        })
        res.status(200).json(id ? result[0] : result)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.post('/', isUser, async (req, res) => {
    let { content, offset }: { content: string; offset: IPos } = req.body
    if (!content || !offset) {
        return res.status(422).json('Must include content and offset in body')
    }

    try {
        let [id] = await knextion('Notes').insert<[number]>({
            content,
            userid: req.user.id,
            posx: offset.x,
            posy: offset.y,
        })
        res.status(200).json({ id })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.put('/:id', isUser, async (req, res) => {
    let { content, offset }: { content: string; offset: IPos } = req.body
    let id = req.params.id
    if (!content && !offset) {
        return res.status(200).json('Nothing updated')
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

        await knextion('Notes')
            .where({ id })
            .update({
                content,
                posx: offset && offset.x,
                posy: offset && offset.y,
            })
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', isUser, async (req, res) => {
    let id = req.params.id

    try {
        let [{ userid }] = await knextion('Notes')
            .where({ id })
            .select<INote[]>('userid')
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
        res.sendStatus(500)
    }
})

export default router
