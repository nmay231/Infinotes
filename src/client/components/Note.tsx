/** @format */

import * as React from 'react'
import Float from './Float'
import { useNotes } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'

export interface INoteProps {
    id: number
    children: string
    offset: IPos
    userid: number
    username: string
}

const Note: React.FC<INoteProps> = ({ id, children, offset, username, userid }) => {
    const { removeNote } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const handleClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const handleDblClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeNote(id)
        setDraft({ offset, initialContent: children })
    }

    const cancelMouseBubbling: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const cancelTouchBubbling: React.TouchEventHandler = (e: React.TouchEvent) => {
        e.stopPropagation()
    }

    const minWidth = children
        .split(' ')
        .reduce((pre, next) => (pre.length < next.length ? pre : next)).length
    const charWidth =
        2 + (minWidth > children.length ** 0.6 ? minWidth : Math.round(children.length ** 0.7))

    return (
        <Float offset={offset}>
            <div
                className="card p-2 no-select text-center"
                style={{ width: charWidth * 10 }}
                onClick={handleClick}
                onDoubleClick={handleDblClick}
                onMouseDown={cancelMouseBubbling}
                onMouseUp={cancelMouseBubbling}
                onTouchStart={cancelTouchBubbling}
                onTouchEnd={cancelTouchBubbling}
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
