/** @format */

import * as React from 'react'

import usePress, { IPressHandler } from '../utils/usePress'
import Float from './Float'

const offset: IPos = {
    x: -35,
    y: -40,
}

interface IMoveIconProps {
    move: (distance: IPos) => void
}

const MoveIcon: React.FC<IMoveIconProps> = ({ move }) => {
    const handler: IPressHandler = ({ event }) => {
        if (event.type == 'move') {
            move(event.moveChange)
        }
        return 10
    }

    const { eventHandlers } = usePress(handler)

    return (
        <Float offset={offset}>
            <div {...eventHandlers} className="position-absolute card p-2 pointer no-select">
                M
            </div>
        </Float>
    )
}

export default MoveIcon
