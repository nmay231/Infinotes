/** @format */

import * as React from 'react'

import Float from './Float'
import Note from './Note'
import NoteDraft from './NoteDraft'

const Canvas = () => {
    const [pos, setPos] = React.useState<IPos>({ x: 0, y: 0 })

    const [clickPos, setClickPos] = React.useState({ x: 0, y: 0 })
    const [lastTouch, setLastTouch] = React.useState({ x: 0, y: 0 })
    const [isClicking, setIsClicking] = React.useState(false)
    const [cancelClick, setCancelClick] = React.useState(false)

    const [notes, setNotes] = React.useState<(INote & { charWidth: number })[]>([
        { content: 'test', charWidth: 5, offset: { x: 100, y: 500 } },
    ])

    const [noteDraft, setNoteDraft] = React.useState<{
        saveDraft: (content: string) => void
        offset: { x: number; y: number }
        defocus: () => void
        initialContent?: string
    } | null>(null)

    const addNoteDraft = (offset: IPos, initialContent: string = '') => {
        setIsClicking(false)
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
        const defocus = () => setNoteDraft(null)
        setNoteDraft({ saveDraft, offset, defocus, initialContent })
    }

    const clickHandler: React.MouseEventHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        switch (e.type) {
            case 'mousedown':
                if (cancelClick) {
                    setCancelClick(false)
                }
                setIsClicking(true)
                setClickPos({ x: e.clientX, y: e.clientY })
                break
            case 'mousemove':
                if (!isClicking) {
                    break
                }
                setPos({ x: pos.x + e.movementX, y: pos.y + e.movementY })
                break
            case 'mouseup':
                if ((e.clientX - clickPos.x) ** 2 + (e.clientY - clickPos.y) ** 2 > 64) {
                    setIsClicking(false)
                    break
                }
                const float = document.getElementById('mainFloat')
                addNoteDraft({
                    x: e.clientX - parseInt(float.style.marginLeft) - 20,
                    y: e.clientY - parseInt(float.style.marginTop) - 10,
                })
                break
        }
    }

    const touchHandler: React.TouchEventHandler = (e: React.TouchEvent) => {
        // Prevent Mouse events from running
        if (e.type === 'touchend') e.preventDefault()

        const touch = e.touches[0]
        switch (e.type) {
            case 'touchstart':
                if (cancelClick) {
                    setCancelClick(false)
                }
                setIsClicking(true)
                setClickPos({ x: touch.pageX, y: touch.pageY })
                setLastTouch({ x: touch.pageX, y: touch.pageY })
                break
            case 'touchmove':
                if (!isClicking) {
                    break
                }
                setPos(({ x, y }) => ({
                    x: x + (touch.clientX - lastTouch.x),
                    y: y + (touch.clientY - lastTouch.y),
                }))
                setLastTouch({ x: touch.clientX, y: touch.clientY })
                break
            case 'touchend':
                if ((lastTouch.x - clickPos.x) ** 2 + (lastTouch.y - clickPos.y) ** 2 > 64) {
                    setIsClicking(false)
                    break
                }
                const float = document.getElementById('mainFloat')
                addNoteDraft({
                    x: clickPos.x - parseInt(float.style.marginLeft) - 20,
                    y: clickPos.y - parseInt(float.style.marginTop) - 10,
                })
                break
        }
    }

    return (
        <section className="row d-flex justify-content-center min-vw-100 min-vh-100">
            <div
                onMouseDown={clickHandler}
                onMouseUp={clickHandler}
                onMouseMove={clickHandler}
                onMouseLeave={() => setIsClicking(false)}
                onTouchStart={touchHandler}
                onTouchEnd={touchHandler}
                onTouchMove={touchHandler}
                onTouchCancel={() => setIsClicking(false)}
                id="canvas"
                className="position-absolute w-100 h-100"
                style={{ overflow: 'hidden' }} // Apparently, this is necessary. Don't remove it
            >
                <Float offset={pos} id="mainFloat">
                    {notes.map(({ content, charWidth, offset }, i) => (
                        <Float key={i} offset={offset}>
                            <Note charWidth={charWidth} addNoteDraft={addNoteDraft} offset={offset}>
                                {content}
                            </Note>
                        </Float>
                    ))}
                    {noteDraft && (
                        <Float offset={noteDraft.offset}>
                            <NoteDraft
                                onSubmit={noteDraft.saveDraft}
                                onDefocus={noteDraft.defocus}
                                initialContent={noteDraft.initialContent}
                            />
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
            <Float offset={{ x: 0, y: 15 }}>
                <div className="btn btn-primary" onClick={() => setPos({ x: 0, y: 0 })}>
                    Reset
                </div>
            </Float>
        </section>
    )
}

export default Canvas
