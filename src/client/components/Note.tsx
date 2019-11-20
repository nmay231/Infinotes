/** @format */

import * as React from 'react'

import usePress, { IPressHandler } from '../utils/usePress'

import Float from './Float'
import { useDispatch, useSelector } from 'react-redux'
import { editNote } from '../redux/actions/noteActions'

export interface INoteProps extends Pick<INote, 'id' | 'offset' | 'username'> {
    children: string
}

const footerStyle = {
    color: '#6c757d',
    fontSize: '80%',
}

const Note: React.FC<INoteProps> = ({ id, children, offset, username }) => {
    const dispatch = useDispatch()
    const token = useSelector((state: IReduxState) => state.token)
    const notes = useSelector((state: IReduxState) => state.visibleNotes)
    const draft = useSelector((state: IReduxState) => state.draft)

    const isEditable = (note_id: number) =>
        token.role === 'admin' ||
        notes.filter((note) => note.id === note_id)[0].user_id === token.user_id

    const pressHandler: IPressHandler = ({ event }) => {
        if (
            event.isStationary &&
            isEditable(id) &&
            (event.type === 'double' || (event.origin === 'touch1' && event.type === 'hold'))
        ) {
            if (!draft) {
                dispatch(editNote(id))
            }
        } else if (event.isStationary && event.type !== 'start' && event.type !== 'end') {
            return 1
        }
    }

    const { eventHandlers } = usePress(pressHandler)

    const minWidth = 2 + Math.round(children.length ** 0.5) + 'rem'

    return (
        <Float offset={offset} centerX>
            <div
                className="card p-2 no-select text-center"
                style={{ width: 'auto', height: 'auto', minWidth, maxWidth: '16rem' }}
                {...eventHandlers}
            >
                {children}
                <p className="mb-0" style={footerStyle}>
                    by <i>{username}</i>
                </p>
            </div>
        </Float>
    )
}

export default React.memo(
    Note,
    (prev, next) =>
        prev.children === next.children &&
        prev.offset.x === next.offset.x &&
        prev.offset.y === next.offset.y,
)
