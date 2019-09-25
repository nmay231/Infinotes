/** @format */

import { Router } from 'express'

import NotesRouter from './notes'
import UsersRouter from './users'

const router = Router()

router.use('/notes', NotesRouter)
router.use('/users', UsersRouter)

router.use('*', (req, res) => res.status(404).send('Unknown Endpoint'))

export default router
