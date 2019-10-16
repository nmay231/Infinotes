/** @format */

import { Reducer } from 'redux'
import { noteActions } from '../actions/noteActions'

const draft: Reducer<IState['draft']> = (state = null, action) => {
    switch (action.type) {
        case noteActions.NEW_DRAFT:
            return {
                content: action.content,
                offset: action.offset,
                noteId: action.noteId,
            }
        case noteActions.DISCARD_DRAFT:
        case noteActions.REVERT_DRAFT:
            return null
        default:
            return state
    }
}

export default draft
