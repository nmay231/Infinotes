/** @format */
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

import { unauthedJson, join, NOTES_API, USERS_API } from '../../utils/apis'

type MyThunk<A extends Action = Action> = ThunkAction<void, IReduxState, [], A>

export const noteActions = {
    INIT_NOTES: 'INIT_NOTES',
    ADD_LOCAL_NOTE: 'ADD_LOCAL_NOTE',
    HIDE_LOCAL_NOTE: 'HIDE_LOCAL_NOTE',
    CHANGE_LOCAL_NOTE: 'CHANGE_LOCAL_NOTE',

    POST_NOTE: 'POST_NOTE',
    PUT_NOTE: 'PUT_NOTE',
    GET_NOTE: 'GET_NOTE',
    DELETE_NOTE: 'DELETE_NOTE',
    FAILED_NOTE_REQUEST: 'FAILED_NOTE_REQUEST',

    NEW_DRAFT: 'NEW_DRAFT',
    EDIT_NOTE: 'EDIT_NOTE',
    SAVE_DRAFT: 'SAVE_DRAFT',
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

export const failedNoteRequest = (from: string, errMessage: string, userMessage: string) => ({
    type: noteActions.FAILED_NOTE_REQUEST,
    from,
    errMessage,
    userMessage,
})

export const getNote = (id: number, jsonFunc: typeof unauthedJson): MyThunk => {
    return async (dispatch) => {
        try {
            dispatch({ type: noteActions.GET_NOTE, id })
            let note = await jsonFunc<INote>(join(NOTES_API, `${id}`))
            if (!note) {
                return dispatch(
                    failedNoteRequest(
                        'getNote',
                        'Note not sent from server',
                        'Failed to get note from server',
                    ),
                )
            }
            let { username } = await jsonFunc<Pick<INote, 'username'>>(
                join(USERS_API, `${note.userid}`, 'username'),
            )
            dispatch(addNote({ ...note, username }))
        } catch (err) {
            dispatch(failedNoteRequest('getNote', err.message, 'Failed to get note from server'))
        }
    }
}

export const postNote = (
    note: Pick<INote, 'content' | 'offset'>,
    jsonFunc: typeof unauthedJson,
): MyThunk => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: noteActions.POST_NOTE, note })
            const { id } = await jsonFunc<Pick<INote, 'id'>>(NOTES_API, 'POST', note)
            const { userid } = getState().token
            // TODO: Change server side to send username in token
            const { username } = await jsonFunc<Pick<INote, 'username'>>(
                join(USERS_API, `${userid}`, 'username'),
            )
            dispatch(addNote({ ...note, id, username, userid }))
        } catch (err) {
            dispatch(failedNoteRequest('postNote', err.message, 'Failed to create new note'))
        }
    }
}

export const putNote = (
    note: Pick<INote, 'id'> & Partial<INote>,
    jsonFunc: typeof unauthedJson,
): MyThunk => {
    return async (dispatch) => {
        try {
            dispatch({ type: noteActions.PUT_NOTE, note })
            await jsonFunc(join(NOTES_API, `${note.id}`), 'PUT', note)
            dispatch(getNote(note.id, jsonFunc))
        } catch (err) {
            dispatch(failedNoteRequest('putNote', err.message, 'Failed to update note'))
        }
    }
}

export const deleteNote = (id: number, jsonFunc: typeof unauthedJson): MyThunk => {
    return async (dispatch) => {
        try {
            dispatch({ type: noteActions.DELETE_NOTE, id })
            await jsonFunc(join(NOTES_API, `${id}`), 'DELETE')
            dispatch(hideNote(id))
        } catch (err) {
            dispatch(failedNoteRequest('deleteNote', err.message, 'Failed to delete note'))
        }
    }
}

export const newDraft = (note: Partial<INote>) => ({
    type: noteActions.NEW_DRAFT,
    content: note.content || '',
    offset: note.offset || { x: 0, y: 0 },
    noteId: note.id || undefined,
})

export const editNote = (id: number): MyThunk => {
    return async (dispatch, getState) => {
        let [note] = getState().visibleNotes.filter((note) => note.id === id)
        dispatch(hideNote(id))
        dispatch(newDraft(note))
    }
}

export const saveDraft = (
    draft: Pick<INote, 'content' | 'offset'>,
    jsonFunc: typeof unauthedJson,
): MyThunk => {
    return async (dispatch, getState) => {
        let { noteId } = getState().draft
        dispatch({ type: noteActions.SAVE_DRAFT })
        if (noteId) {
            dispatch(putNote({ id: noteId, ...draft }, jsonFunc))
        } else {
            dispatch(postNote(draft, jsonFunc))
        }
    }
}

export const discardDraft = (jsonFunc: typeof unauthedJson): MyThunk => {
    return (dispatch, getState) => {
        let { noteId } = getState().draft
        dispatch({ type: noteActions.DISCARD_DRAFT })
        if (noteId) {
            dispatch(deleteNote(noteId, jsonFunc))
        }
    }
}

export const revertDraft = (jsonFunc: typeof unauthedJson): MyThunk => {
    return async (dispatch, getState) => {
        let { noteId } = getState().draft
        dispatch({ type: noteActions.REVERT_DRAFT })
        dispatch(getNote(noteId, jsonFunc))
    }
}
