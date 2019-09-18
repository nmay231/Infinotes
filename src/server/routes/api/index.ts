/** @format */

import { Router } from 'express'

import NotesRouter from './notes'

const router = Router()

router.use('/notes', NotesRouter)

router.use('*', (req, res) => res.send('Unknown Endpoint'))

export default router
