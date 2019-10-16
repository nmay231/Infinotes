/** @format */

import * as React from 'react'
import { useDispatch } from 'react-redux'

import useLogin from '../utils/useLogin'
import usePress, { IPressHandler } from '../utils/usePress'
import { discardDraft, revertDraft, saveDraft } from '../redux/actions/noteActions'

import Float from './Float'
import MoveIcon from './MoveIcon'

interface INoteDraftProps {
    draft: IState['draft']
}

const NoteDraft: React.FC<INoteDraftProps> = ({ draft }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap') {
            document.getElementById('noteDraftInput').focus()
        }
        if (event.type !== 'move') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { json } = useLogin()
    const dispatch = useDispatch()

    const [offset, setOffset] = React.useState(draft && draft.offset)
    const [content, setContent] = React.useState(draft && draft.content)

    React.useEffect(() => {
        try {
            document.getElementById('noteDraftInput').focus()
        } catch (err) {}
    }, [offset])

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // TODO: Change submit button to be disabled if content.length === 0
        if (!content.length) {
            if (draft.noteId) {
                dispatch(discardDraft(json))
            } else {
                dispatch(revertDraft())
            }
        } else {
            dispatch(saveDraft({ content, offset }, json))
        }
    }

    const deleteSelf = () => dispatch(discardDraft(json))

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    const moveDraft = (distance: IPos) =>
        setOffset((old) => ({ x: old.x + distance.x, y: old.y + distance.y }))

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <Float offset={offset} centerX>
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
