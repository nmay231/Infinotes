/** @format */

import { Reducer } from 'redux'

import { noteActions } from '../actions/noteActions'

const draft: Reducer<IReduxState['draft']> = (state = null, action) => {
    switch (action.type) {
        case noteActions.NEW_DRAFT:
            return {
                content: action.content,
                offset: action.offset,
                note_id: action.note_id,
            }
        case noteActions.SAVE_DRAFT: // Discard the draft after manually saving it
        case noteActions.DISCARD_DRAFT:
        case noteActions.REVERT_DRAFT:
            return null
        default:
            return state
    }
}

export default draft
