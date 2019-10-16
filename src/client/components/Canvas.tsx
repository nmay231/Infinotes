/** @format */

import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import usePress, { IPressHandler } from '../utils/usePress'
import useLogin from '../utils/useLogin'
import { newDraft } from '../redux/actions/noteActions'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'
import SelectionMenu from './SelectionMenu'

interface ICanvasProps extends RouteComponentProps {}

const Canvas: React.FC<ICanvasProps> = ({ history }) => {
    const notes = useSelector((state: IState) => state.visibleNotes)
    const draft = useSelector((state: IState) => state.draft)
    const dispatch = useDispatch()

    const pressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && event.isStationary) {
            const float = document.getElementById('mainFloat')
            dispatch(
                newDraft({
                    offset: {
                        x: event.startPos.x - float.offsetLeft,
                        y: event.startPos.y - float.offsetTop,
                    },
                    content: '',
                }),
            )
        } else if (event.type === 'move') {
            setPos((pos) => ({
                x: pos.x + event.moveChange.x,
                y: pos.y + event.moveChange.y,
            }))
        }
    }

    const { eventHandlers } = usePress(pressHandler)
    const { isLoggedIn } = useLogin()

    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    // const createDraft = (draft: { offset: IPos; initialContent: string }) => {
    //     if (!isLoggedIn) {
    //         return history.push('/login')
    //     }
    //     setDraft(draft)
    // }

    React.useEffect(() => {
        if (!localStorage.getItem('fullscreen')) {
            // I'll figure out how to detect if you're on a mobile device later
            alert("If you're on a mobile device, toggle fullscreen for a better experience")
            localStorage.setItem('fullscreen', 'fullscreen')
        }
    }, [])

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
                    {draft && <NoteDraft draft={draft} />}
                </Float>
            </div>
            <SelectionMenu resetView={() => setPos({ x: 0, y: 0 })} />
        </>
    )
}

export default withRouter(Canvas)
