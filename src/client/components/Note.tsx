/** @format */

import * as React from 'react'

export interface INoteProps {
    children: string
    addNoteDraft: (offset: IPos, initialContent: string) => void
    offset: IPos
    removeMe: () => void
}

const Note: React.FC<INoteProps> = ({ children, addNoteDraft, offset, removeMe }) => {
    const handleClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const handleDblClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
        addNoteDraft(offset, children)
        removeMe()
    }

    const CancelBubbling: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const minWidth = children
        .split(' ')
        .reduce((pre, next) => (pre.length < next.length ? pre : next)).length
    const charWidth =
        2 + (minWidth > children.length ** 0.6 ? minWidth : Math.round(children.length ** 0.7))
    console.log('test')

    return (
        <div
            className="card p-2 no-select text-center"
            style={{ width: charWidth * 10 }}
            onClick={handleClick}
            onDoubleClick={handleDblClick}
            onMouseDown={CancelBubbling}
            onMouseUp={CancelBubbling}
        >
            {children}
        </div>
    )
}

export default React.memo(
    Note,
    (prev, next) =>
        prev.children === next.children &&
        prev.offset.x === next.offset.x &&
        prev.offset.y === next.offset.y,
)
