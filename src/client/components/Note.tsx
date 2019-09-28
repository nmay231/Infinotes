/** @format */

import * as React from 'react'
import Float from './Float'
import { useNotes } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'
import useTouch, { HandlerFunc } from '../utils/useTouch'

export interface INoteProps {
    id: number
    children: string
    offset: IPos
    userid: number
    username: string
}

const Note: React.FC<INoteProps> = ({ id, children, offset, username, userid }) => {
    const pressHandler: HandlerFunc = ({ event }) => {
        if (
            event.isStationary &&
            isEditable(id) &&
            (event.type === 'double' || (event.origin === 'touch1' && event.type === 'hold'))
        ) {
            removeNote(id)
            setDraft({ offset, initialContent: children })
        } else if (event.isStationary && event.type !== 'start' && event.type !== 'end') {
            return 1
        }
    }

    const { events } = useTouch(pressHandler)
    const { isEditable, removeNote } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const minWidth = 2 + Math.round(children.length ** 0.5) + 'rem'

    return (
        <Float offset={offset}>
            <div
                className="card p-2 no-select text-center"
                style={{ width: 'auto', height: 'auto', minWidth }}
                {...events}
            >
                {children}
                <footer className="blockquote-footer">{username}</footer>
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
