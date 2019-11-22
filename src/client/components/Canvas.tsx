/** @format */

import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import gql from 'graphql-tag'
import { Draft, Note as INote } from '../../schema/graphql'

import usePress, { IPressHandler } from '../utils/usePress'
import useLogin from '../utils/useLogin'
import { useQuery, getNotes, useMutation, newDraft as newDraftMutation } from '../utils/graphql'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'
import SelectionMenu from './SelectionMenu'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const [newDraft, { loading: draftLoading, data: draftData, called }] = useMutation<{
        newDraft: Draft
    }>(gql(newDraftMutation('id', 'noteId', 'content', 'offset')))
    const { data, loading, error } = useQuery<{ notes: INote[] }>(
        gql(getNotes(null, 'id', 'content', 'offset', { user: ['username'] })),
    )

    const { isLoggedIn, wasUser } = useLogin()

    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && event.isStationary) {
            if (isLoggedIn) {
                const float = document.getElementById('mainFloat')
                console.log('New draft')
                newDraft({
                    variables: {
                        offset: {
                            x: event.startPos.x - float.offsetLeft,
                            y: event.startPos.y - float.offsetTop,
                        },
                        content: '',
                    },
                })
            } else {
                return history.push(wasUser ? '/login' : '/register')
            }
        } else if (event.type === 'move') {
            setPos((pos) => ({
                x: pos.x + event.moveChange.x,
                y: pos.y + event.moveChange.y,
            }))
        }
    }

    const { eventHandlers } = usePress(pressHandler)

    React.useEffect(() => {
        if (!localStorage.getItem('fullscreen')) {
            // TODO: I'll figure out how to detect if you're on a mobile device later
            alert("If you're on a mobile device, toggle fullscreen for a better experience")
            localStorage.setItem('fullscreen', 'fullscreen')
        }
    }, [])

    React.useEffect(() => {
        if (error) {
            console.error(error)
            // TODO: alert
        }
    }, [error])

    return (
        <>
            <div
                {...eventHandlers}
                id="canvas"
                className="position-absolute w-100 h-100"
                style={{ overflow: 'hidden', background: 'white' }}
            >
                <Float offset={pos} id="mainFloat" centerContainer>
                    {!loading && data.notes.map((note) => <Note key={note.id} note={note} />)}
                    {called && !draftLoading && <NoteDraft id={draftData.newDraft.id} />}
                </Float>
            </div>
            <SelectionMenu resetView={() => setPos({ x: 0, y: 0 })} />
        </>
    )
}

export default withRouter(Canvas)
