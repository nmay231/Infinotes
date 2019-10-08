/** @format */

import * as React from 'react'
import Float from './Float'
import { useNotes } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'
import usePress, { IPressHandler } from '../utils/usePress'
import MoveIcon from './MoveIcon'

interface INoteDraftProps {
    offset: IPos
}

const NoteDraft: React.FC<INoteDraftProps> = ({ offset }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        return 1
    }

    const { eventHandlers } = usePress(pressHandler)
    const { addNote } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    if (!draft) {
        return <></>
    }

    const [offset_, setOffset_] = React.useState(offset)
    const [content, setContent] = React.useState(draft.initialContent)

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content.length) {
            return setDraft(null)
        }
        addNote({ offset: offset_, content })
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
        <Float offset={offset_}>
            <MoveIcon move={(d) => setOffset_((old) => ({ x: old.x + d.x, y: old.y + d.y }))} />
            <div
                id="noteDraft"
                className="card p-2 d-flex flex-row"
                style={{ width: '20rem' }}
                {...eventHandlers}
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
