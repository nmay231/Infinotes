/** @format */

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import usePress, { IPressHandler } from '../utils/usePress'

const style = { marginLeft: -35, marginTop: -40 }

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
        <div className="position-absolute" style={style}>
            <div {...eventHandlers} className="card p-2 pointer no-select">
                <FontAwesomeIcon icon="expand-arrows-alt" />
            </div>
        </div>
    )
}

export default MoveIcon
