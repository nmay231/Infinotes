/** @format */

import * as knex from 'knex'

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
