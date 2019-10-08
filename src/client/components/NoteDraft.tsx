/** @format */

import * as React from 'react'

import { useNotes } from '../utils/useNotes'
import usePress, { IPressHandler } from '../utils/usePress'
import { NoteDraftContext } from './context/NoteDraftContext'

import Float from './Float'
import MoveIcon from './MoveIcon'

interface INoteDraftProps {
    offset: IPos
}

const NoteDraft: React.FC<INoteDraftProps> = ({ offset }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap') {
            document.getElementById('noteDraftInput').focus()
        }
        if (event.type !== 'move') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { addNote, updateNote, removeNote } = useNotes()
    // Using context here causes a render when it's unmounted
    // Will be fixed with the introduction of redux
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const [offset_, setOffset_] = React.useState(offset)
    const [content, setContent] = React.useState(draft.initialContent)

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content.length && draft.noteId) {
            removeNote(draft.noteId)
        } else if (content.length) {
            if (draft.noteId) {
                updateNote({ id: draft.noteId, content, offset: offset_ })
            } else {
                addNote({ offset: offset_, content })
            }
        }
        setDraft(null)
    }

    const deleteSelf = () => {
        if (draft.noteId) {
            removeNote(draft.noteId)
        }
        setDraft(null)
    }

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    React.useEffect(() => {
        document.getElementById('noteDraftInput').focus()
    }, [offset])

    const moveDraft = (distance: IPos) =>
        setOffset_((old) => ({ x: old.x + distance.x, y: old.y + distance.y }))

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <Float offset={offset_} centerX>
            <MoveIcon move={moveDraft} />
            <div
                id="noteDraft"
                className="d-flex flex-column justify-content-center"
                {...eventHandlers}
            >
                <form className="card p-2 mb-1" onSubmit={handleSubmit}>
                    <textarea
                        rows={4}
                        id="noteDraftInput"
                        className="form-control text-center"
                        style={{ minWidth: '16rem', resize: 'none' }}
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </form>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                        onTouchEnd={handleSubmit}
                    >
                        ✓
                    </button>
                    <button
                        role="button"
                        className="btn btn-danger ml-2"
                        onClick={deleteSelf}
                        onTouchEnd={deleteSelf}
                    >
                        &times;
                    </button>
                </div>
            </div>
        </Float>
    )
}

export default NoteDraft
