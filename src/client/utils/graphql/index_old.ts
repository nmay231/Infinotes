/** @format */

// /** @format */

// import gql from 'graphql-tag'

// export { useQuery, useMutation } from '@apollo/react-hooks'

// type TField<T> = (keyof T) | { [K in keyof T]?: TField<T[K]>[] }

// const formatField = <T>(main: string, fields: TField<T>[]) => {
//     let formattedFields = main + '{'
//     for (let field of fields) {
//         if (typeof field !== 'object') {
//             formattedFields += field + ','
//         } else {
//             for (let sub in field) {
//                 formattedFields += formatField(sub, field[sub]) + ','
//             }
//         }
//     }
//     return formattedFields + '}'
// }

// /** User queries */
// export { gql }

// export const getUser = (id: number | string, ...fields: TField<IUser>[]) =>
//     `query getUser{${formatField(`user(id: ${id})`, fields)}}`

// export const getThisUser = (...fields: TField<IUser>[]) =>
//     `query getThisUser{${formatField(`thisUser`, fields)}}`

// /** Note queries */
// export const getNote = (id: number | string, ...fields: TField<INote>[]) =>
//     `query getNote{${formatField(`note(id: ${id})`, fields)}}`

// export const getNotes = (ids?: Array<number | string>, ...fields: TField<INote>[]) =>
//     `query getNotes{${formatField(ids ? `notes(ids: ${ids})` : 'notes', fields)}}`

// export const addNote = (...fields: TField<INote>[]) =>
//     `mutation addNote($content: String!, $offset: Position!) {
//         ${formatField('addNote(content: $content, offset: $offset)', fields)}
//     }`

// // export const editNote = (id: number | string, ...fields: TField<INote>[]) =>
// //     `mutation addNote($content: String!, $offset: Position!) {
// //         ${formatField(`editNote(id: ${id},content: $content, offset: $offset)`, fields)}
// //     }`
// // export const deleteNote = (...fields: TField<INote>[]) =>
// //     `mutation addNote($content: String!, $offset: Position!) {
// //         ${formatField('addNote(content: $content, offset: $offset)', fields)}
// //     }`
// // editNote(id: ID!, content: String, offset: Position): Note!
// // deleteNote(id: ID!): Note

// /** Draft queries */
// export const getDraft = (id: number | string, ...fields: TField<IDraft>[]) =>
//     `query getDraft{${formatField(`draft(id: ${id})`, fields)}}`

// export const noteToDraft = (...fields: TField<IDraft>[]) =>
//     `mutation noteToDraft($id: ID!) {${formatField(`noteToDraft(id: $id)`, fields)}}`

// export const updateDraft = (...fields: TField<IDraft>[]) =>
//     `mutation updateDraft($id: ID!, $content: String, $offset: Position){
//         ${formatField(`updateDraft(id: $id, content: $content, offset: $offset)`, fields)}
//     }`
// export const deleteDraft = (...fields: TField<IDraft>[]) =>
//     `mutation deleteDraft($id: ID!, $saveToNote: Boolean!){
//         ${formatField(`deleteDraft(id: $id, saveToNote: $saveToNote)`, fields)}
//     }`
// export const newDraft = (...fields: TField<IDraft>[]) =>
//     `mutation newDraft($content: String!, $offset: Position!) {
//         ${formatField('newDraft(content: $content, offset: $offset)', fields)}
//     }`

// export const fragment = <T>(type: string, ...fields: TField<T>[]) =>
//     `
//         ${formatField(`fragment update${type} on ${type}`, fields)}
//     `
