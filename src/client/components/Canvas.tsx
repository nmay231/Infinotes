/** @format */

import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import usePress, { IPressHandler } from '../utils/usePress'
import useLogin from '../utils/useLogin'
import {
    CanvasDraftsOnBoardDocument,
    useCanvasNotesOnBoardQuery,
    useCanvasDraftsOnBoardQuery,
    useCanvasNewDraftMutation,
} from '@graphql/querys'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'
import SelectionMenu from './SelectionMenu'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const [newDraft] = useCanvasNewDraftMutation()
    const { data: draftData, loading: draftLoading } = useCanvasDraftsOnBoardQuery()
    const { data, error, loading } = useCanvasNotesOnBoardQuery()

    const { isLoggedIn, wasUser } = useLogin()

    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && event.isStationary) {
            if (isLoggedIn) {
                const float = document.getElementById('mainFloat')
                newDraft({
                    variables: {
                        offset: {
                            x: event.startPos.x - float.offsetLeft,
                            y: event.startPos.y - float.offsetTop,
                        },
                        content: '',
                    },
                    update(store, { data: { addDraft } }) {
                        const { drafts } = store.readQuery({ query: CanvasDraftsOnBoardDocument })
                        store.writeQuery({
                            query: CanvasDraftsOnBoardDocument,
                            data: { drafts: [...drafts, addDraft] },
                        })
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
                    {!draftLoading &&
                        draftData &&
                        draftData.drafts.map((draft) => <NoteDraft key={draft.id} draft={draft} />)}
                </Float>
            </div>
            <SelectionMenu resetView={() => setPos({ x: 0, y: 0 })} />
        </>
    )
}

export default withRouter(Canvas)
