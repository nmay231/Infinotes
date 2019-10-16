/** @format */
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import { unauthedJson, join, NOTES_API, USERS_API } from '../../utils/apis'

export const noteActions = {
    INIT_NOTES: 'INIT_NOTES',
    ADD_LOCAL_NOTE: 'ADD_LOCAL_NOTE',
    HIDE_LOCAL_NOTE: 'HIDE_LOCAL_NOTE',
    CHANGE_LOCAL_NOTE: 'CHANGE_LOCAL_NOTE',

    POST_NOTE: 'POST_NOTE',
    GET_NOTE: 'GET_NOTE',
    DELETE_NOTE: 'DELETE_NOTE',
    FAILED_NOTE_REQUEST: 'FAILED_NOTE_REQUEST',

    NEW_DRAFT: 'NEW_DRAFT',
    EDIT_NOTE: 'EDIT_NOTE',
    DISCARD_DRAFT: 'DISCARD_DRAFT',
    REVERT_DRAFT: 'REVERT_DRAFT_BACK_TO_NOTE',
}

export const initNotes = (notes: INote[]) => ({
    type: noteActions.INIT_NOTES,
    notes,
})

export const addNote = (note: INote) => ({
    type: noteActions.ADD_LOCAL_NOTE,
    note,
})

export const hideNote = (id: number) => ({
    type: noteActions.HIDE_LOCAL_NOTE,
    id,
})

export const changeNote = (note: Pick<INote, 'id'> & Partial<INote>) => ({
    type: noteActions.CHANGE_LOCAL_NOTE,
    note,
})

const failedNoteRequest = (from: string, err: string, userMessage: string) => ({
    type: noteActions.FAILED_NOTE_REQUEST,
    from,
    err,
    userMessage,
})

export const getNote = (
    id: number,
    jsonFunc: typeof unauthedJson = unauthedJson,
): ThunkAction<void, IState, [], Action> => {
    return async (dispatch) => {
        try {
            dispatch({ type: noteActions.GET_NOTE, id })
            let note = await jsonFunc<INote>(join(NOTES_API, `${id}`))
            if (note) {
                dispatch(addNote(note))
            }
        } catch (err) {
            dispatch(failedNoteRequest('getNote', err, 'Failed to get note from server'))
        }
    }
}

export const postNote = (
    note: Pick<INote, 'content' | 'offset'>,
    jsonFunc: typeof unauthedJson,
): ThunkAction<void, IState, [], Action> => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: noteActions.POST_NOTE })
            const id = await jsonFunc<INote['id']>(NOTES_API, 'POST', note)
            const { userid } = getState().token
            // TODO: Change server side to send username in token
            const username = await jsonFunc<INote['username']>(
                join(USERS_API, `${userid}`, 'username'),
            )
            dispatch(addNote({ ...note, id, username, userid }))
        } catch (err) {
            dispatch(failedNoteRequest('postNote', err, 'Failed to create new note'))
        }
    }
}

export const putNote = () => ({})

export const deleteNote = (
    id: number,
    jsonFunc: typeof unauthedJson,
): ThunkAction<void, IState, [], Action> => {
    return async (dispatch) => {
        try {
            dispatch({ type: noteActions.DELETE_NOTE, id })
            await jsonFunc(join(NOTES_API, `${id}`), 'DELETE')
            dispatch(hideNote(id))
        } catch (err) {
            dispatch(failedNoteRequest('deleteNote', err, 'Failed to delete note'))
        }
    }
}

export const newDraft = (content: string = '', noteId?: number) => ({
    type: noteActions.NEW_DRAFT,
    content,
    noteId,
})

export const editNote = (id: number): ThunkAction<void, IState, [], Action> => {
    return async (dispatch, getState) => {
        let [note] = getState().visibleNotes.filter((note) => note.id === id)
        dispatch(hideNote(id))
        dispatch(newDraft(note.content, note.id))
    }
}

export const discardDraft = (
    jsonFunc: typeof unauthedJson,
): ThunkAction<void, IState, [], Action> => {
    return (dispatch, getState) => {
        let { noteId } = getState().draft
        dispatch({ type: noteActions.DISCARD_DRAFT })
        if (noteId) {
            dispatch(deleteNote(noteId, jsonFunc))
        }
    }
}

export const revertDraft = (): ThunkAction<void, IState, [], Action> => {
    return async (dispatch, getState) => {
        let { noteId } = getState().draft
        dispatch({ type: noteActions.REVERT_DRAFT })
        dispatch(getNote(noteId))
    }
}
