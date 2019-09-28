/** @format */

import * as React from 'react'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'
import useLogin from '../utils/useLogin'
import { useNotes, useNoteDraft } from '../utils/useNotes'
import { NoteDraftContext } from './context/NoteDraftContext'
import { RouteComponentProps, withRouter } from 'react-router'
import useTouch, { HandlerFunc } from '../utils/useTouch'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const pressHandler: HandlerFunc = ({ event }) => {
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

    const { events } = useTouch(pressHandler)
    const { isLoggedIn } = useLogin()
    const { notes } = useNotes()
    const [draft, setDraft] = React.useContext(NoteDraftContext)

    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    const createDraft = (draft: { offset: IPos; initialContent: string }) => {
        if (!isLoggedIn) {
            return history.push('/login')
        }
        setDraft(draft)
    }

    return (
        <>
            <div
                {...events}
                id="canvas"
                className="position-absolute w-100 h-100"
                style={{ overflow: 'hidden' }} // Apparently, this is necessary. Don't remove it
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
                    <Float offset={{ x: 200, y: 100 }}>
                        <div
                            className="border border-danger d-flex flex-column justify-content-center align-items-center"
                            style={{ height: '30rem', width: '30rem' }}
                        >
                            <span style={{ fontSize: '2rem' }}>Click and drag to move around</span>
                            <span style={{ fontSize: '2rem' }}>Click to add a note</span>
                            <span style={{ fontSize: '1rem' }}>(press enter to submit)</span>
                        </div>
                    </Float>
                    <Float offset={{ x: -300, y: 300 }}>Why hello there!</Float>
                    <Float offset={{ x: 1200, y: 300 }}>How is it going?</Float>
                    <Float offset={{ x: 600, y: 1100 }}>Going down!</Float>
                    <Float offset={{ x: 600, y: -300 }}>Going up!</Float>
                </Float>
            </div>
            <Float offset={{ x: 0, y: 15 }}>
                <div className="btn btn-primary" onClick={() => setPos({ x: 0, y: 0 })}>
                    Reset
                </div>
            </Float>
        </>
    )
}

export default withRouter(Canvas)
