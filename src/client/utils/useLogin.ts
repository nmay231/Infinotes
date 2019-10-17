/** @format */

import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios'
import { Method } from 'axios'

import { LOGIN_ENDPOINT, REGISTER_ENDPOINT, unauthedJson } from './apis'
import { logout as logoutAction, setToken, failLogin } from '../redux/actions/userActions'

const maxFailedLoginAttempts = 5

const useLogin = () => {
    const token = useSelector((state: IReduxState) => state.token)
    const failedLoginAttempts = useSelector((state: IReduxState) => state.failedLoginAttempts)
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(logoutAction())
        localStorage.removeItem('user')
    }

    const loginLocal = async (username: string, password: string) => {
        if (failedLoginAttempts >= maxFailedLoginAttempts) {
            return false
        }
        try {
            let user = (await Axios.post<IToken>(LOGIN_ENDPOINT, { username, password })).data
            dispatch(setToken(user))
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('wasUser', 'yes')
            return true
        } catch (err) {
            dispatch(failLogin())
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
            dispatch(setToken(user))
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
            // TODO: Need to double check token is still valid
            dispatch(setToken(user))
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
        if (token && token.token) {
            headers = { ...(headers || {}), Authorization: `Bearer ${token.token}` }
        }
        return unauthedJson<T>(url, method, body, headers)
    }

    return {
        token,
        logout,
        loginLocal,
        register,
        loginFromCache,
        json,

        isLockedOut: failedLoginAttempts >= maxFailedLoginAttempts,
        isLoggedIn: token.role !== 'guest',
        isAdmin: Boolean(token.role === 'admin'),
        wasUser: Boolean(localStorage.getItem('wasUser')),

        // Do I really need this?
        tellIfUser: (userid: number) => token.userid === userid,
    }
}

export default useLogin
