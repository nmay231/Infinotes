/** @format */

import * as React from 'react'

export interface INoteProps {
    children: string
    charWidth: number
    addNoteDraft: (offset: IPos, initialContent: string) => void
    offset: IPos
}

const Note: React.FC<INoteProps> = ({ charWidth, children, addNoteDraft, offset }) => {
    const handleClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('test')
    }

    const handleDblClick: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
        addNoteDraft(offset, children)
    }

    const CancelBubbling: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div
            className="card p-2 no-select"
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

export default Note
