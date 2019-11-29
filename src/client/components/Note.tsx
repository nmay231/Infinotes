/** @format */

import * as React from 'react'
import {
    useNoteNoteToDraftMutation,
    CanvasDraftsOnBoardDocument,
    CanvasNotesOnBoardDocument,
} from '@graphql/querys'
import { Note } from '@graphql/resolvers'

import usePress, { IPressHandler } from '../utils/usePress'
import { tokenHolder } from '../utils/useLogin'

import Float from './Float'

export interface INoteProps {
    note: Pick<Note, 'id' | 'content' | 'offset'> & { user: Pick<Note['user'], 'username' | 'id'> }
}

const footerStyle = {
    color: '#6c757d',
    fontSize: '80%',
}

const Note: React.FC<INoteProps> = ({ note: { content, id, offset, user } }) => {
    const isEditable = tokenHolder.role === 'admin' || user.id === tokenHolder.user_id

    const pressHandler: IPressHandler = ({ event }) => {
        if (
            event.isStationary &&
            isEditable &&
            (event.type === 'double' || (event.origin === 'touch1' && event.type === 'hold'))
        ) {
            noteToDraft({ variables: { noteId: id } })
        } else if (event.isStationary && event.type !== 'start' && event.type !== 'end') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)

    const [noteToDraft] = useNoteNoteToDraftMutation({
        update(store, { data: { noteToDraft } }) {
            const { drafts } = store.readQuery({ query: CanvasDraftsOnBoardDocument })
            store.writeQuery({
                query: CanvasDraftsOnBoardDocument,
                data: { drafts: [...drafts, noteToDraft] },
            })
            const { notes } = store.readQuery({ query: CanvasNotesOnBoardDocument })
            store.writeQuery({
                query: CanvasNotesOnBoardDocument,
                data: { notes: notes.filter((note: any) => note.id !== id) },
            })
        },
    })

    const minWidth = 2 + Math.round(content.length ** 0.5) + 'rem'

    return (
        <Float offset={offset} centerX>
            <div
                className="card p-2 no-select text-center"
                style={{ width: 'auto', height: 'auto', minWidth, maxWidth: '16rem' }}
                {...eventHandlers}
            >
                {content}
                <p className="mb-0" style={footerStyle}>
                    by <i>{user.username}</i>
                </p>
            </div>
        </Float>
    )
}

export default React.memo(
    Note,
    ({ note: prev }, { note: next }) =>
        prev.content === next.content &&
        prev.offset.x === next.offset.x &&
        prev.offset.y === next.offset.y,
)
