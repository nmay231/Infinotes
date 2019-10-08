/** @format */

import * as React from 'react'
import Float from './Float'
import { useNotes } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'
import useTouch, { HandlerFunc } from '../utils/useTouch'

interface INoteDraftProps {
    offset: IPos
}

const NoteDraft: React.FC<INoteDraftProps> = ({ offset }) => {
    const pressHandler: HandlerFunc = ({ event }) => {
        return 1
    }

    const { events } = useTouch(pressHandler)
    const { addNote } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    if (!draft) {
        return <></>
    }

    const [content, setContent] = React.useState(draft.initialContent)

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content.length) {
            return setDraft(null)
        }
        addNote({ offset, content })
        setDraft(null)
    }

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    React.useEffect(() => {
        document.getElementById('noteDraftInput').focus()
    }, [offset])

    return (
        <Float offset={offset}>
            <div
                id="noteDraft"
                className="card p-2 d-flex flex-row"
                style={{ width: '20rem' }}
                {...events}
            >
                <form onSubmit={handleSubmit}>
                    <input
                        id="noteDraftInput"
                        type="text"
                        className="form-control ml-auto mb-n3"
                        value={content}
                        onChange={handleChange}
                    />
                </form>
                <button
                    className="btn btn-success ml-2"
                    onClick={handleSubmit}
                    onTouchEnd={handleSubmit}
                >
                    ✓
                </button>
                <button
                    role="button"
                    className="btn btn-danger ml-2"
                    onClick={() => setDraft(null)}
                    onTouchEnd={() => setDraft(null)}
                >
                    &times;
                </button>
            </div>
        </Float>
    )
}

export default NoteDraft
