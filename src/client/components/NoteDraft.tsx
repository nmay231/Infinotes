/** @format */

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Draft } from '../../schema/graphql'
import gql from 'graphql-tag'

import usePress, { IPressHandler } from '../utils/usePress'

import Float from './Float'
import MoveIcon from './MoveIcon'
import StyledButton from './commons/StyledButton'
import {
    useMutation,
    deleteDraft as deleteDraftMutation,
    updateDraft as updateDraftMutation,
    getDraft,
    fragment,
    useQuery,
    getNote,
} from '../utils/graphql'

interface INoteDraftProps {
    id: Draft['id']
}

const NoteDraft: React.FC<INoteDraftProps> = ({ id }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap') {
            document.getElementById('noteDraftInput').focus()
        }
        if (event.type !== 'move') {
            return Infinity
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { data, loading, error } = useQuery<{ draft: Draft }>(
        gql(getDraft(id, 'id', 'noteId', 'content', 'offset')),
    )
    const [updateDraft] = useMutation(gql(updateDraftMutation('id', 'content', 'offset')))
    const [deleteDraft] = useMutation(gql(deleteDraftMutation('noteId', 'content', 'offset')), {
        update(store, { data: { deleteDraft } }) {},
    })

    const [offset, setOffset] = React.useState<IPos>({ x: 0, y: 0 })
    const [content, setContent] = React.useState('')

    React.useEffect(() => {
        try {
            document.getElementById('noteDraftInput').focus()
        } catch (err) {}
    }, [offset])

    React.useEffect(() => {
        if (error) {
            console.error(error)
            return
        }
        if (!loading) {
            setContent(data.draft.content)
            setOffset(data.draft.offset)
        }
    }, [loading, error])

    // const save = () => dispatch(saveDraft({ content, offset }, json))
    const save = () => {
        updateDraft({ variables: { id, content, offset } })
        deleteDraft({ variables: { id, saveToNote: true } })
    }
    // const revert = () => dispatch(revertDraft(json))
    // const discard = () => dispatch(discardDraft(json))
    const revert = () => {}
    const discard = () => {}

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

    if (loading) {
        return <></>
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
                    {data.draft.note && (
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
