/** @format */

import { Reducer } from 'redux'

import { userActions } from '../actions/userActions'

export const dummyUser: IToken = {
    token: undefined,
    first_name: 'first',
    last_name: 'last',
    user_id: -1,
    role: 'guest',
}

const initialState = { ...dummyUser, failedAttempts: 0 }

const token: Reducer<IReduxState['token']> = (state = initialState, action) => {
    switch (action.type) {
        case userActions.LOGOUT:
            return initialState
        case userActions.LOGIN:
            return { ...action.token, failedAttempts: 0 }
        default:
            return state
    }
}

export default token
