/** @format */

import * as React from 'react'

import { NoteDraftContext } from '../components/context/NoteDraftContext'
import { NOTES_API, join, USERS_API } from './apis'
import useLogin from './useLogin'
import { useSelector, useDispatch } from 'react-redux'
import {
    initNotes,
    hideNote as hideNoteAction,
    getNote,
    postNote,
    deleteNote,
} from '../redux/actions/noteActions'

export const useNotes = () => {
    const { json, token } = useLogin()

    const notes = useSelector((state: IState) => state.visibleNotes)
    const draft = useSelector((state: IState) => state.draft)
    const dispatch = useDispatch()

    const fetchNotes = async (from: IPos = { x: 0, y: 0 }) => {
        try {
            let rawNotes = await json<INote[]>(NOTES_API)
            rawNotes = await Promise.all<INote>(
                rawNotes.map((note) =>
                    json<{ username: string }>(join(USERS_API, `${note.userid}`, 'username')).then(
                        ({ username }) => Promise.resolve({ ...note, username }),
                    ),
                ),
            )
            dispatch(initNotes(rawNotes))
        } catch (err) {
            console.error('Failed to retrieve notes from server')
        }
    }

    const fetchNote = async (id: number) => dispatch(getNote(id))

    const addNote = async (note: Pick<INote, 'content' | 'offset'>) =>
        dispatch(postNote(note, json))

    const hideNote = async (id: number) => dispatch(hideNoteAction(id))

    const updateNote = async (note: Pick<INote, 'id'> & Partial<INote>) => {
        //TODO: update note
        // const { content, offset } = note
        // await json(join(NOTES_API, `${note.id}`), 'PUT', { content, offset })
        // fetchNote(note.id)
    }

    const removeNote = async (id: number) => {
        dispatch(deleteNote(id, json))
    }

    // TODO
    const notesBy = (userid: number) => {}

    const isEditable = (noteId: number) => {
        return (
            token.role === 'admin' ||
            notes.filter((note) => note.id === noteId)[0].userid === token.userid
        )
    }

    return {
        notes,
        fetchNotes,
        fetchNote,
        addNote,
        hideNote,
        updateNote,
        removeNote,
        notesBy,
        isEditable,
    }
}

export const useNoteDraft = () => {
    // TODO
    const [draft, setDraft] = React.useContext(NoteDraftContext)
    return {
        draft,
    }
}
