/** @format */

import { gql, concatenateTypeDefs } from 'apollo-server-express'

const position = gql`
    type Position {
        x: Int!
        y: Int!
    }
`

const note = gql`
    type Note {
        id: ID!
        content: String!
        offset: Position!
        user: User
    }
`

const user = gql`
    type User {
        id: ID!
        username: String!
        role: String
        hash: String
        firstname: String
        lastname: String
        numberOfNotes: Int
        _created: DateTime
    }
`

const query = gql`
    scalar DateTime
    type Query {
        hello: String
        note(id: ID!): Note!
        notes(ids: [ID!]!): [Note!]!
    }
`

// declare interface IUser {
//     id: number
//     username: string
//     role: 'guest' | 'user' | 'admin'
//     hash: string
//     firstName: string
//     lastName: string
//     numberOfNotes: number
//     _created: Date
// }

// // Auth
// declare interface IPayload {
//     userid: number
//     tokenid?: number
//     expires?: Date
//     unique?: string
// }

// declare interface IToken {
//     userid: number
//     firstName: string
//     lastName: string
//     role: 'guest' | 'user' | 'admin'
//     token: string
// }

export default concatenateTypeDefs([query, note, user, position])
