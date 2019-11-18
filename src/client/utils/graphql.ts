/** @format */

import gql from 'graphql-tag'

export { tokenHolder, client } from './graphql-client'
export { useQuery, useMutation } from '@apollo/react-hooks'

type TField<T> = (keyof T) | Partial<{ [K in keyof T]?: TField<T[K]>[] }>

const formatField = <T>(main: string, fields: TField<T>[]) => {
    let formattedFields = main + '{'
    for (let field of fields) {
        if (typeof field !== 'object') {
            formattedFields += field + ','
        } else {
            for (let sub in field) {
                formattedFields += formatField(sub, field[sub]) + ','
            }
        }
    }
    return formattedFields + '}'
}

export const grabNote = (id: number | string, ...fields: TField<INote>[]) =>
    gql`query grabNote{${formatField(`note(id: ${id})`, fields)}}`

export const grabNotes = (ids?: number, ...fields: TField<INote>[]) =>
    gql`query grabNotes{${formatField(ids ? `notes(ids: ${ids})` : 'notes', fields)}}`

export const grabUser = (id: number, ...fields: TField<IUser>[]) =>
    gql`query grabUser{${formatField(`user(id: ${id})`, fields)}}`

export const grabThisUser = (...fields: TField<IUser>[]) =>
    gql`query grabThisUser{${formatField(`thisUser`, fields)}}`

export const addNote = (...fields: TField<INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField('addNote(content: $content, offset: $offset)', fields)}
    }`

export const editNote = (...fields: TField<INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField('addNote(content: $content, offset: $offset)', fields)}
    }`
export const deleteNote = (...fields: TField<INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField('addNote(content: $content, offset: $offset)', fields)}
    }`

// editNote(id: ID!, content: String, offset: Position): Note!
// deleteNote(id: ID!): Note

export const fragment = <T>(type: string, ...fields: TField<T>[]) =>
    gql`{${formatField(`fragment update${type} on ${type}`, fields)}}`
