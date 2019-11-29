/** @format */

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import usePress, { IPressHandler } from '../utils/usePress'
import {
    useNoteDraftQuery,
    useNoteDraftUpdateDraftMutation,
    useNoteDraftSaveDraftToExistingMutation,
    useNoteDraftSaveNewDraftMutation,
    useNoteDraftDeleteDraftMutation,
    useNoteDraftDeleteNoteMutation,
    CanvasDraftsOnBoardDocument,
    CanvasNotesOnBoardDocument,
} from '@graphql/querys'

import Float from './Float'
import MoveIcon from './MoveIcon'
import StyledButton from './commons/StyledButton'

interface INoteDraftProps {
    id: string
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

    const { data, loading, error } = useNoteDraftQuery({ variables: { id } })
    const [updateDraft] = useNoteDraftUpdateDraftMutation()
    const [deleteDraft] = useNoteDraftDeleteDraftMutation({
        update(store, { data: { deleteDraft } }) {
            const data = store.readQuery({ query: CanvasDraftsOnBoardDocument })
            store.writeQuery({
                query: CanvasDraftsOnBoardDocument,
                data: { drafts: (data as any).drafts.filter((draft: any) => draft.id !== id) },
            })
            if (deleteDraft.note) {
                const { notes } = store.readQuery({ query: CanvasNotesOnBoardDocument })
                store.writeQuery({
                    query: CanvasNotesOnBoardDocument,
                    data: { notes: [...notes, deleteDraft.note] },
                })
            }
        },
    })
    const [saveNewDraft] = useNoteDraftSaveNewDraftMutation({
        update(store, { data: { deleteDraft, addNote } }) {
            const { drafts } = store.readQuery({ query: CanvasDraftsOnBoardDocument })
            store.writeQuery({
                query: CanvasDraftsOnBoardDocument,
                data: { drafts: drafts.filter((draft: any) => draft.id !== deleteDraft.id) },
            })
            const { notes } = store.readQuery({ query: CanvasNotesOnBoardDocument })
            store.writeQuery({
                query: CanvasNotesOnBoardDocument,
                data: { notes: [...notes, addNote] },
            })
        },
    })
    const [saveDraftToExisting] = useNoteDraftSaveDraftToExistingMutation({
        update(store, { data: { deleteDraft, updateNote } }) {
            const { drafts } = store.readQuery({ query: CanvasDraftsOnBoardDocument })
            store.writeQuery({
                query: CanvasDraftsOnBoardDocument,
                data: { drafts: drafts.filter((draft: any) => draft.id !== deleteDraft.id) },
            })
            const { notes } = store.readQuery({ query: CanvasNotesOnBoardDocument })
            store.writeQuery({
                query: CanvasNotesOnBoardDocument,
                data: { notes: [...notes, updateNote] },
            })
        },
    })
    const [deleteNote] = useNoteDraftDeleteNoteMutation({
        update(store, { data: { deleteNote } }) {
            const { notes } = store.readQuery({ query: CanvasNotesOnBoardDocument })
            store.writeQuery({
                query: CanvasNotesOnBoardDocument,
                data: { notes: notes.filter((note: any) => note.id !== deleteNote.id) },
            })
        },
    })

    const [offset, setOffset] = React.useState<IPos>(null)
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

    const save = () => {
        if (data.draft.note) {
            saveDraftToExisting({ variables: { id, content, offset, noteId: data.draft.note.id } })
        } else {
            saveNewDraft({ variables: { id, content, offset } })
        }
    }
    const revert = () => deleteDraft({ variables: { id } })
    const discard = () => {
        if (data.draft.note) {
            deleteNote({ variables: { id: data.draft.note.id } })
        }
        deleteDraft({ variables: { id } })
    }

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

    if (loading || !offset) {
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
