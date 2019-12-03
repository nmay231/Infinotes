/** @format */

import * as express from 'express'

import AuthRouter from './auth'

const router = express.Router()

router.use(express.json())
router.use('/auth', AuthRouter)

export default router
