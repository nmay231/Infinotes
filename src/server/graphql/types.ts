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
        draft(id: ID!): Draft!
        drafts: [Draft!]!
    }
    type Mutation {
        addNote(content: String!, offset: Position!): Note!
        editNote(id: ID!, content: String, offset: Position): Note!
        deleteNote(id: ID!): Note
        noteToDraft(noteId: ID!): Draft!
        newDraft(content: String!, offset: Position!): Draft!
        updateDraft(id: ID!, content: String, offset: Position): Draft!
        deleteDraft(id: ID!, saveToNote: Boolean!): Draft
    }
    type User {
        id: ID!
        username: String!
        role: UserRole!
        firstName: String!
        lastName: String
        fullName: String!
        notes: [Note!]!
        numberOfNotes: Int!
        _created: DateTime!
    }
    type Note {
        id: ID!
        content: String!
        offset: Position!
        user: User!
    }
    type Draft {
        id: ID!
        noteId: ID
        content: String!
        offset: Position!
        user: User!
    }
`

export default typeDefs
