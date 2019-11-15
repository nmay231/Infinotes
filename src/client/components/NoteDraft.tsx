/** @format */

import * as React from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useLogin from '../utils/useLogin'
import usePress, { IPressHandler } from '../utils/usePress'
import { discardDraft, revertDraft, saveDraft } from '../redux/actions/noteActions'

import Float from './Float'
import MoveIcon from './MoveIcon'
import StyledButton from './commons/StyledButton'
import { useMutation, editNote as editNoteMutation } from '../utils/graphql'

interface INoteDraftProps {
    draft: IReduxState['draft']
}

const NoteDraft: React.FC<INoteDraftProps> = ({ draft }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap') {
            document.getElementById('noteDraftInput').focus()
        }
        if (event.type !== 'move') {
            return Infinity
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const [editNote, { data }] = useMutation(editNoteMutation('content', 'offset'), {
        refetchQueries: ['grabNote', 'grabNotes'],
    })
    const { json } = useLogin()
    const dispatch = useDispatch()

    const [offset, setOffset] = React.useState(draft.offset)
    const [content, setContent] = React.useState(draft.content)

    React.useEffect(() => {
        try {
            document.getElementById('noteDraftInput').focus()
        } catch (err) {}
    }, [offset])

    // const save = () => dispatch(saveDraft({ content, offset }, json))
    const save = () => editNote({ variables: { content, offset } })
    const revert = () => dispatch(revertDraft(json))
    const discard = () => dispatch(discardDraft(json))

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    const moveDraft = (distance: IPos) =>
        setOffset((old) => ({ x: old.x + distance.x, y: old.y + distance.y }))

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter') {
            e.preventDefault()
            save()
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
                <form className="card p-2 mb-1" onSubmit={save}>
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
                    <StyledButton btnStyle="success" disabled={!content.length} onPress={save}>
                        <FontAwesomeIcon icon="check" />
                    </StyledButton>
                    {draft.noteId && (
                        <StyledButton btnStyle="primary" className="ml-2" onPress={revert}>
                            <FontAwesomeIcon icon="undo-alt" />
                        </StyledButton>
                    )}
                    <StyledButton btnStyle="danger" className="ml-2" onPress={discard}>
                        <FontAwesomeIcon icon="trash-alt" />
                    </StyledButton>
                </div>
            </div>
        </Float>
    )
}

export default NoteDraft
