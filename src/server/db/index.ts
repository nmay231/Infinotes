/** @format */

import * as knex from 'knex'

export interface User {
    id: number
    username: string
    role: 'user' | 'guest' | 'admin'
    hash: string
    firstName: string
    lastName: string
    numberOfNotes: number
    _created: Date
}

const knextion = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
})

export default knextion
