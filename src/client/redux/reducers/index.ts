/** @format */

import { combineReducers } from 'redux'

import token from './token'
import failedLoginAttempts from './failedLoginAttempts'

export default combineReducers<IState>({
    token,
    failedLoginAttempts,
})
