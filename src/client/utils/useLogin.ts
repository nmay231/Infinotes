/** @format */

const emptyToken: IToken = {
    token: null,
    user_id: '-1',
    firstName: null,
    lastName: null,
    role: 'guest',
}

export const tokenHolder: IToken = { ...emptyToken }

export const setToken = (token: Partial<IToken>) => {
    Object.assign(tokenHolder, token)
    localStorage.setItem('token', JSON.stringify(token))
    localStorage.setItem('wasUser', 'yes')
}

const LOGIN_ENDPOINT = '/auth/login'
const REGISTER_ENDPOINT = '/auth/register'

const useLogin = () => {
    const logout = () => {
        Object.assign(tokenHolder, emptyToken)
        localStorage.removeItem('token')
    }
    const loginLocal = async (username: string, password: string) => {
        try {
            let token: IToken = await fetch(LOGIN_ENDPOINT, {
                method: 'POST',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            }).then((res) => res.json())
            setToken(token)
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
            let token: IToken = await fetch(REGISTER_ENDPOINT, {
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    password,
                }),
            }).then((res) => res.json())
            setToken(token)
            return true
        } catch (err) {
            return false
        }
    }

    const loginFromCache = () => {
        const token: IToken = JSON.parse(localStorage.getItem('token'))
        if (token) {
            Object.assign(tokenHolder, token)
            return true
        }
        return false
    }

    return {
        logout,
        loginLocal,
        register,
        loginFromCache,

        isLoggedIn: tokenHolder.role !== 'guest',
        isAdmin: Boolean(tokenHolder.role === 'admin'),
        wasUser: Boolean(localStorage.getItem('wasUser')),
    }
}

export default useLogin
