/** @format */

import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import usePress, { IPressHandler } from '../utils/usePress'
import useLogin from '../utils/useLogin'
import { useNotes } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && event.isStationary) {
            const float = document.getElementById('mainFloat')
            createDraft({
                offset: {
                    x: event.startPos.x - float.offsetLeft,
                    y: event.startPos.y - float.offsetTop,
                },
                initialContent: '',
            })
        } else if (event.type === 'move') {
            setPos((pos) => ({
                x: pos.x + event.moveChange.x,
                y: pos.y + event.moveChange.y,
            }))
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { isLoggedIn, logout, wasUser } = useLogin()
    const { notes } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    const createDraft = (draft: { offset: IPos; initialContent: string }) => {
        if (!isLoggedIn) {
            return history.push('/login')
        }
        setDraft(draft)
    }

    React.useEffect(() => {
        if (!localStorage.getItem('fullscreen')) {
            // I'll figure out how to detect if you're on a mobile device later
            alert("If you're on a mobile device, toggle fullscreen for a better experience")
            localStorage.setItem('fullscreen', 'fullscreen')
        }
    }, [])

    const handleFullscreen = (e: React.MouseEvent) => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    return (
        <>
            <div
                {...eventHandlers}
                id="canvas"
                className="position-absolute w-100 h-100"
                style={{ overflow: 'hidden', background: 'white' }}
            >
                <Float offset={pos} id="mainFloat" centerContainer>
                    {notes.map((note) => {
                        let { content, id } = note
                        return (
                            <Note key={id} id={id} {...note}>
                                {content}
                            </Note>
                        )
                    })}
                    {draft && <NoteDraft {...draft} />}
                </Float>
            </div>
            <div className="position-relative" style={{ maxHeight: '5rem' }}>
                testing
            </div>
            <div className="position-relative my-auto ml-auto" style={{ top: '50%' }}>
                <div className="d-flex flex-column flex-wrap justify-content-center mr-2">
                    {document.fullscreenEnabled && (
                        <div className="btn btn-primary my-2" onClick={handleFullscreen}>
                            Toggle Fullscreen
                        </div>
                    )}
                    <div className="btn btn-primary my-2" onClick={() => setPos({ x: 0, y: 0 })}>
                        Reset View
                    </div>
                    {isLoggedIn ? (
                        <div className="btn btn-primary my-2" onClick={logout}>
                            Logout
                        </div>
                    ) : (
                        <div
                            className="btn btn-primary mr-2 my-2"
                            onClick={() => history.push(wasUser ? '/login' : '/register')}
                        >
                            {wasUser ? 'Login' : 'Register'}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default withRouter(Canvas)
