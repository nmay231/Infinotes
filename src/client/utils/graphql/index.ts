/** @format */

import { Note } from '../../../schema/graphql'

export { useQuery, useMutation } from '@apollo/react-hooks'

type TField<T> = (keyof T) | { [K in keyof T]?: TField<T[K]>[] }

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

const formatQuery = <T>(
    type: 'query' | 'mutation' | 'subscription',
    name: string,
    variables: (keyof T)[],
    fields: TField<T>[],
) => formatField(`${type} ${name}()`, fields)

/** Note queries */
export const getNote = (...noteFields: TField<Note>[]) =>
    formatQuery<Note>('query', 'getNote', ['id', 'content', 'offset'], [])

export const fragment = <T>(type: string, ...fields: TField<T>[]) =>
    `
        ${formatField(`fragment update${type} on ${type}`, fields)}
    `
