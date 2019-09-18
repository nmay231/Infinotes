/** @format */

import * as express from 'express'

import AuthRouter from './auth'
import APIRouter from './api'

const router = express.Router()

router.use(express.json())
router.use('/auth', AuthRouter)
router.use('/api', APIRouter)

export default router
