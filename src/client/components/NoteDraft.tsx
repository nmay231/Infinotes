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
        if (event.type !== 'move') {
            return 1
        }
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

    const moveDraft = (distance: IPos) =>
        setOffset_((old) => ({ x: old.x + distance.x, y: old.y + distance.y }))

    const minWidth = 2 + Math.round(content.length ** 0.5) + 'rem'

    return (
        <Float offset={offset_} center2>
            <MoveIcon move={moveDraft} />
            <div
                id="noteDraft"
                className="p-2 d-flex flex-column justify-content-center"
                {...eventHandlers}
            >
                <form className="card p-2" onSubmit={handleSubmit}>
                    <textarea
                        rows={4}
                        cols={100}
                        id="noteDraftInput"
                        className="form-control text-center"
                        style={{ minWidth }}
                        value={content}
                        onChange={handleChange}
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
                        onClick={() => setDraft(null)}
                        onTouchEnd={() => setDraft(null)}
                    >
                        &times;
                    </button>
                </div>
            </div>
        </Float>
    )
}

export default NoteDraft
