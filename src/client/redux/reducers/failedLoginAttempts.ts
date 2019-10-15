/** @format */

import { Reducer } from 'redux'

import { userActions } from '../actions/userActions'

const failedLoginAttempts: Reducer<IState['failedLoginAttempts']> = (state = 0, action) => {
    switch (action.type) {
        case userActions.FAILED_LOGIN:
            return state + 1
        default:
            return state
    }
}

export default failedLoginAttempts
