/** @format */

import * as React from 'react'

export interface IFloatProps {
    offset: IPos
    id?: string
}

const Float: React.FC<IFloatProps> = ({ offset: { x, y }, id, children }) => {
    return (
        <div id={id} className="position-absolute" style={{ marginLeft: x, marginTop: y }}>
            {children}
        </div>
    )
}

export default Float
