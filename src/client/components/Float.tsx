/** @format */

import * as React from 'react'

export interface IFloatProps {
    offset: IPos
    id?: string
    centerContainer?: boolean
    centerX?: boolean
}

const Float: React.FC<IFloatProps> = ({
    offset: { x, y },
    id,
    children,
    centerContainer,
    centerX,
}) => {
    return (
        <div
            id={id}
            className="position-absolute"
            style={{
                marginLeft: x,
                marginTop: y,
                ...(centerContainer ? { left: '50%', top: '50%' } : {}),
            }}
        >
            <div className="position-relative" style={centerX ? { left: '-50%', top: '-50%' } : {}}>
                {children}
            </div>
        </div>
    )
}

export default Float
