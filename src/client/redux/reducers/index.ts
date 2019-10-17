/** @format */

import { combineReducers } from 'redux'

import token from './token'
import failedLoginAttempts from './failedLoginAttempts'
import visibleNotes from './visibleNotes'
import draft from './draft'

export default combineReducers<IReduxState>({
    token,
    failedLoginAttempts,
    visibleNotes,
    draft,
})
