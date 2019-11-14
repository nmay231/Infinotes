/** @format */

import { gql } from 'apollo-server-express'

const typeDefs = gql`
    scalar DateTime
    scalar Position
    scalar UserRole
    type Query {
        note(id: ID!): Note
        notes(ids: [ID!]): [Note!]!
        user(id: ID!): User
        thisUser: User
    }
    type Mutation {
        addNote(content: String!, offset: Position!): Note!
        editNote(id: ID!, content: String, offset: Position): Note!
        deleteNote(id: ID!): Note
    }
    type User {
        id: ID!
        username: String!
        role: UserRole!
        firstName: String!
        lastName: String
        fullName: String!
        numberOfNotes: Int!
        _created: DateTime!
    }
    type Note {
        id: ID!
        content: String!
        offset: Position!
        user: User!
    }
`

export default typeDefs
