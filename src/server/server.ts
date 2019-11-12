/** @format */

import * as express from 'express'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as helmet from 'helmet'

import * as path from 'path'

import apiRouter from './routes'
import { graphqlServer } from './graphql'
import './middlewares'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(express.static('public'))
graphqlServer.applyMiddleware({ app, path: '/api/graphql' })
app.use(apiRouter)

app.use('*', (req, res) => res.sendFile(path.resolve(__dirname, '../public/index.html')))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port: ${port}`))
