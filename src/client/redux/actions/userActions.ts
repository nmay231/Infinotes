/** @format */

export const userActions = {
    LOGOUT: 'USER_LOGOUT',
    LOGIN: 'USER_LOGIN',
    FAILED_LOGIN: 'USER_FAILED_LOGIN',
}

export const logout = () => ({
    type: userActions.LOGOUT,
})

export const setToken = (token: IToken) => ({
    type: userActions.LOGIN,
    token,
})

export const failLogin = () => ({
    type: userActions.FAILED_LOGIN,
})
