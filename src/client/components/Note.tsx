/** @format */

import * as React from 'react'

import usePress, { IPressHandler } from '../utils/usePress'
import { useNotes } from '../utils/useNotes'

import Float from './Float'
import { NoteDraftContext } from './context/NoteDraftContext'

export interface INoteProps extends Pick<INote, 'id' | 'offset' | 'username'> {
    children: string
}

const footerStyle = {
    color: '#6c757d',
    fontSize: '80%',
}

const Note: React.FC<INoteProps> = ({ id, children, offset, username }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (
            event.isStationary &&
            isEditable(id) &&
            (event.type === 'double' || (event.origin === 'touch1' && event.type === 'hold'))
        ) {
            if (!draft) {
                hideNote(id)
                setDraft({ offset, initialContent: children, noteId: id })
            }
        } else if (event.isStationary && event.type !== 'start' && event.type !== 'end') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { isEditable, hideNote } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const minWidth = 2 + Math.round(children.length ** 0.5) + 'rem'

    return (
        <Float offset={offset} centerX>
            <div
                className="card p-2 no-select text-center"
                style={{ width: 'auto', height: 'auto', minWidth, maxWidth: '16rem' }}
                {...eventHandlers}
            >
                {children}
                <p className="mb-0" style={footerStyle}>
                    by <i>{username}</i>
                </p>
            </div>
        </Float>
    )
}

export default React.memo(
    Note,
    (prev, next) =>
        prev.children === next.children &&
        prev.offset.x === next.offset.x &&
        prev.offset.y === next.offset.y,
)
