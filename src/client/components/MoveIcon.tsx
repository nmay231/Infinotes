/** @format */

import * as React from 'react'
import Float from './Float'
import useTouch, { HandlerFunc } from '../utils/useTouch'

const off: IPos = {
    x: -35,
    y: -40,
}

interface IMoveIconProps {
    move: (distance: IPos) => void
}

const MoveIcon: React.FC<IMoveIconProps> = ({ move }) => {
    const handler: HandlerFunc = ({ event }) => {
        if (event.type == 'move') {
            move(event.moveChange)
        }
        return 10
    }

    const { events } = useTouch(handler)

    return (
        <Float offset={off}>
            <div {...events} className="position-absolute card p-2 pointer no-select">
                M
            </div>
        </Float>
    )
}

export default MoveIcon
