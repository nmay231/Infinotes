/** @format */

import { dummyUser } from '../../components/context/LoginContext'
import { Reducer } from 'redux'
import { userActions } from '../actions/userActions'

const initialState = { ...dummyUser, failedAttempts: 0 }

const token: Reducer<IState['token']> = (state = initialState, action) => {
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
