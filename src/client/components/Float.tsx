/** @format */

import * as React from 'react'

export interface IFloatProps {
    offset: IPos
    id?: string
    center1?: boolean
    center2?: boolean
}

const Float: React.FC<IFloatProps> = ({ offset: { x, y }, id, children, center1, center2 }) => {
    return (
        <div
            id={id}
            className="position-absolute"
            style={{
                marginLeft: x,
                marginTop: y,
                ...(center1 ? { left: '50%', top: '50%' } : {}),
            }}
            // style={{ marginLeft: x, marginTop: y }}
        >
            <div className="position-relative" style={center2 ? { left: '-50%', top: '-50%' } : {}}>
                {children}
            </div>
        </div>
    )
}

export default Float
