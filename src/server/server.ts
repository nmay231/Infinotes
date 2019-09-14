/** @format */

import * as express from 'express'
import * as path from 'path'
import * as morgan from 'morgan'

import apiRouter from './routes'

const app = express()

app.use(morgan('dev'))
app.use(express.static('public'))
app.use(apiRouter)

app.use('*', (req, res) => res.sendFile(path.resolve(__dirname, '../public/index.html')))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port: ${port}`))
