/** @format */

import { Reducer } from 'redux'

import { userActions } from '../actions/userActions'

const failedLoginAttempts: Reducer<IReduxState['failedLoginAttempts']> = (state = 0, action) => {
    switch (action.type) {
        case userActions.FAILED_LOGIN:
            return state + 1
        default:
            return state
    }
}

export default failedLoginAttempts
