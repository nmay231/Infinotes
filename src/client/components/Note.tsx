/** @format */

import * as React from 'react'
import { Note } from '../../schema/graphql'

import usePress, { IPressHandler } from '../utils/usePress'

import Float from './Float'

export interface INoteProps {
    note: Note
}

const footerStyle = {
    color: '#6c757d',
    fontSize: '80%',
}

const Note: React.FC<INoteProps> = ({
    note: {
        content,
        id,
        offset,
        user: { username },
    },
}) => {
    const isEditable = (noteId: string) => true
    // token.role === 'admin' ||
    // notes.filter((note) => note.id === noteId)[0].userid === token.userid

    const pressHandler: IPressHandler = ({ event }) => {
        if (
            event.isStationary &&
            isEditable(id) &&
            (event.type === 'double' || (event.origin === 'touch1' && event.type === 'hold'))
        ) {
            // if (!draft) {
            //     dispatch(editNote(id))
            // }
        } else if (event.isStationary && event.type !== 'start' && event.type !== 'end') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)

    const minWidth = 2 + Math.round(content.length ** 0.5) + 'rem'

    return (
        <Float offset={offset} centerX>
            <div
                className="card p-2 no-select text-center"
                style={{ width: 'auto', height: 'auto', minWidth, maxWidth: '16rem' }}
                {...eventHandlers}
            >
                {content}
                <p className="mb-0" style={footerStyle}>
                    by <i>{username}</i>
                </p>
            </div>
        </Float>
    )
}

export default React.memo(
    Note,
    ({ note: prev }, { note: next }) =>
        prev.content === next.content &&
        prev.offset.x === next.offset.x &&
        prev.offset.y === next.offset.y,
)
