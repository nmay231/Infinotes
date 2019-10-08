/** @format */

import * as React from 'react'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'
import useLogin from '../utils/useLogin'
import { useNotes, useNoteDraft } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'
import { RouteComponentProps, withRouter } from 'react-router'
import usePress, { IPressHandler } from '../utils/usePress'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && event.isStationary) {
            const float = document.getElementById('mainFloat')
            createDraft({
                offset: {
                    x: event.startPos.x - parseInt(float.style.marginLeft),
                    y: event.startPos.y - parseInt(float.style.marginTop),
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
                <Float offset={pos} id="mainFloat">
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
            <Float offset={{ x: 0, y: 15 }}>
                <div className="d-flex flex-wrap justify-content-center">
                    {document.fullscreenEnabled && (
                        <div className="btn btn-primary mx-2 my-2" onClick={handleFullscreen}>
                            Toggle Fullscreen
                        </div>
                    )}
                    <div
                        className="btn btn-primary mr-2 my-2"
                        onClick={() => setPos({ x: 0, y: 0 })}
                    >
                        Reset View
                    </div>
                    {isLoggedIn ? (
                        <div className="btn btn-primary mr-2 my-2" onClick={logout}>
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
            </Float>
        </>
    )
}

export default withRouter(Canvas)
