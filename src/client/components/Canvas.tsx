/** @format */

import * as React from 'react'

import Float, { IFloatProps } from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'

function getOffset(el: HTMLElement) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const Canvas = () => {
    const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const [clickPos, setClickPos] = React.useState({ x: 0, y: 0 })
    const [isClicking, setIsClicking] = React.useState(false)

    const [notes, setNotes] = React.useState<
        { content: string; charWidth: number; offset: { x: number; y: number } }[]
    >([{ content: 'test', charWidth: 5, offset: { x: 100, y: 500 } }])
    const [noteDraft, setNoteDraft] = React.useState<{
        saveDraft: (content: string) => void
        offset: { x: number; y: number }
    } | null>(null)

    const clickHandler: React.MouseEventHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.type === 'mousemove') {
            if (!isClicking) {
                return
            }
            setPos({ x: pos.x + e.movementX, y: pos.y + e.movementY })
        } else if (e.type === 'mousedown') {
            setIsClicking(true)
            setClickPos({ x: e.clientX, y: e.clientY })
        } else if (e.type === 'mouseup') {
            setIsClicking(false)
            if ((e.clientX - clickPos.x) ** 2 + (e.clientY - clickPos.y) ** 2 > 64) {
                return
            }
            const corner = getOffset(document.getElementById('canvas'))
            const float = document.getElementById('mainFloat')
            const [marginx, marginy] = [
                parseInt(float.style.marginLeft),
                parseInt(float.style.marginTop),
            ]
            const offset = {
                x: e.clientX - marginx - corner.left - 20,
                y: e.clientY - marginy - corner.top - 10,
            }
            const saveDraft = (content: string) => {
                setNotes((prevNotes) => [
                    ...prevNotes,
                    {
                        content,
                        charWidth: Math.round(content.length ** 0.7) + 2,
                        offset,
                    },
                ])
                setNoteDraft(null)
            }
            setNoteDraft({ saveDraft, offset })
        }
    }

    return (
        <section className="row h-100 w-100 d-flex justify-content-center">
            <div
                onMouseDown={clickHandler}
                onMouseUp={clickHandler}
                onMouseMove={clickHandler}
                onMouseLeave={() => setIsClicking(false)}
                id="canvas"
                className="position-absolute my-5 h-75 w-75 card border rounded shadow"
                style={{ overflow: 'hidden' }}
            >
                <Float offset={pos} id="mainFloat">
                    {notes.map(({ content, charWidth, offset }, i) => (
                        <Float key={i} offset={offset}>
                            <Note charWidth={charWidth}>{content}</Note>
                        </Float>
                    ))}
                    {noteDraft && (
                        <Float offset={noteDraft.offset}>
                            <NoteDraft onSubmit={noteDraft.saveDraft} />
                        </Float>
                    )}
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
            <div className="position-absolute">
                <div className="btn btn-primary" onClick={() => setPos({ x: 0, y: 0 })}>
                    Reset
                </div>
            </div>
        </section>
    )
}

export default Canvas
