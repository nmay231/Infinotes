/** @format */

import { Router } from 'express'

import LoginRouter from './login'
import RegisterRouter from './register'

const router = Router()

router.use('/login', LoginRouter)
router.use('/register', RegisterRouter)

router.use('*', (req, res) => res.status(404).json('Unknown Endpoint'))

export default router
