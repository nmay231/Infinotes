/** @format */

import * as React from 'react'

import { NotesContext } from '../components/context/NotesContext'
import { NoteDraftContext } from '../components/context/NoteDraftContext'
import { NOTES_API, join, USERS_API } from './apis'
import useLogin from './useLogin'

export const useNotes = () => {
    const { json, user } = useLogin()

    const [notes, setNotes] = React.useContext(NotesContext)

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
            setNotes(rawNotes)
        } catch (err) {
            console.error('Failed to retrieve notes from server')
        }
    }

    const addNote = async (note: { content: string; offset: IPos }) => {
        try {
            await json(NOTES_API, 'POST', note)
            fetchNotes()
        } catch (err) {
            console.error('Failed to post new note')
        }
    }

    const removeNote = async (id: number) => {
        try {
            await json(join(NOTES_API, `${id}`), 'DELETE')
            fetchNotes()
        } catch (err) {
            console.error('Failed to delete note')
        }
    }

    // TODO
    const notesBy = (userid: number) => {}

    const isEditable = (noteId: number) => {
        return (
            user.role === 'admin' ||
            notes.filter((note) => note.id === noteId)[0].userid === user.userid
        )
    }

    return {
        notes,
        fetchNotes,
        addNote,
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
