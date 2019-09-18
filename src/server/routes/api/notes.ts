/** @format */

import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => res.send('Notes'))

export default router
