/** @format */

import * as React from 'react'
import Axios from 'axios'
import { Method } from 'axios'

import { LoginContext, dummyUser } from '../components/context/LoginContext'
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT, unauthedJson } from './apis'

const useLogin = () => {
    const [user, setUser] = React.useContext(LoginContext)

    const logout = () => {
        setUser(dummyUser)
        localStorage.removeItem('user')
    }

    const loginLocal = async (username: string, password: string) => {
        try {
            let user = (await Axios.post<IToken>(LOGIN_ENDPOINT, { username, password })).data
            setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('wasUser', 'yes')
            return true
        } catch (err) {
            return false
        }
    }

    const register = async (
        firstName: string,
        lastName: string,
        username: string,
        password: string,
    ) => {
        try {
            let user = (await Axios.post<IToken>(REGISTER_ENDPOINT, {
                firstName,
                lastName,
                username,
                password,
            })).data
            setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('wasUser', 'yes')
            return true
        } catch (err) {
            return false
        }
    }

    const loginFromCache = () => {
        let user: IToken = JSON.parse(localStorage.getItem('user'))
        if (user) {
            setUser(user)
            return true
        } else {
            return false
        }
    }

    const json = async <T>(
        url: string,
        method: Method = 'GET',
        body?: {},
        headers?: {},
    ): Promise<T> => {
        if (user && user.token) {
            headers = { ...(headers || {}), Authorization: `Bearer ${user.token}` }
        }
        return unauthedJson<T>(url, method, body, headers)
    }

    return {
        user,
        setUser,
        logout,
        loginLocal,
        register,
        loginFromCache,
        json,

        isLoggedIn: Boolean(user.role && user.token),
        isAdmin: Boolean(user.role === 'admin'),
        isUser: (userid: number) => user.userid === userid,
        wasUser: Boolean(localStorage.getItem('wasUser')),
    }
}

export default useLogin
