/** @format */

import ApolloClient, { gql } from 'apollo-boost'
import fetch from 'isomorphic-fetch'

export const tokenHolder: { token: string } = {
    token: null,
}

const client = new ApolloClient({
    uri: '/api/graphql',
    fetch,
    request: (operation) => {
        operation.setContext({
            headers: {
                authorization: tokenHolder.token ? `Bearer ${tokenHolder.token}` : undefined,
            },
        })
    },
})

type TField<T extends string> = T | { [key: string]: TField<string>[] }

const formatField = <T extends string>(field: TField<T>) => {
    if (typeof field === 'string') {
        return field
    } else {
        let formatted = ''
        for (let sub in field) {
            formatted += `${sub} {
                ${field[sub].map((sub) => formatField(sub)).join(',')}
            }`
        }
        return formatted
    }
}

export const grabNote = (id: number, ...fields: TField<keyof INote>[]) =>
    gql`query grabNote{${formatField({ [`note(id: ${id})`]: fields })}}`

export const grabNotes = (ids?: number, ...fields: TField<keyof INote>[]) =>
    gql`query grabNotes{${formatField({ [`notes${ids ? `(ids: ${ids})` : ''}`]: fields })}}`

export const grabUser = (id: number, ...fields: TField<keyof IUser>[]) =>
    gql`query grabUser{${formatField({ [`user(id: ${id})`]: fields })}}`

export const grabThisUser = (...fields: TField<keyof IUser>[]) =>
    gql`query grabThisUser{${formatField({ [`thisUser`]: fields })}}`

export const addNote = (...fields: TField<keyof INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField({ ['addNote(content: $content, offset: $offset)']: fields })}
    }`

export const editNote = (...fields: TField<keyof INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField({ ['addNote(content: $content, offset: $offset)']: fields })}
    }`
export const deleteNote = (...fields: TField<keyof INote>[]) =>
    gql`mutation addNote($content: String!, $offset: Position!) {
        ${formatField({ ['addNote(content: $content, offset: $offset)']: fields })}
    }`

// editNote(id: ID!, content: String, offset: Position): Note!
// deleteNote(id: ID!): Note

export default client
export { useQuery, useMutation } from '@apollo/react-hooks'
