/** @format */

import { Reducer } from 'redux'

import { noteActions } from '../actions/noteActions'

const visibleNotes: Reducer<IReduxState['visibleNotes']> = (state = [], action) => {
    switch (action.type) {
        case noteActions.INIT_NOTES:
            return action.notes
        case noteActions.HIDE_LOCAL_NOTE:
            return state.filter((note) => note.id !== action.id)
        case noteActions.ADD_LOCAL_NOTE:
            return [action.note, ...state]
        case noteActions.CHANGE_LOCAL_NOTE:
            return state.map((note) =>
                note.id === action.note.id ? { ...note, ...action.note } : note,
            )
        default:
            return state
    }
}

export default visibleNotes
