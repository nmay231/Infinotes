/** @format */

import * as React from 'react'

export interface INoteProps {
    children: React.ReactText
    charWidth: number
}

const Note: React.FC<INoteProps> = ({ charWidth, children }) => {
    return (
        <div className="card p-2" style={{ width: charWidth * 10 }}>
            {children}
        </div>
    )
}

export default Note
