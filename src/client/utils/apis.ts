/** @format */

import Axios from 'axios'
import { Method } from 'axios'

// api
export const NOTES_API = '/api/notes'
export const USERS_API = '/api/users'

// auth
export const LOGIN_ENDPOINT = '/auth/login'
export const REGISTER_ENDPOINT = '/auth/register'

const pathAdd = (a: string, b: string) => {
    if (a.endsWith('/')) a = a.slice(0, a.length - 1)
    if (b.startsWith('/')) b = b.slice(1, b.length)
    return a + '/' + b
}

export function join(...paths: string[]) {
    return paths.reduce((prev, cur) => pathAdd(prev, cur))
}

export const unauthedJson = async <T>(
    url: string,
    method: Method = 'GET',
    body?: {},
    headers?: {},
): Promise<T> => {
    headers = headers || {}
    let result: any = (await Axios.request({
        url,
        method,
        data: body,
        headers,
    })).data

    if (result) {
        return result
    }
}
