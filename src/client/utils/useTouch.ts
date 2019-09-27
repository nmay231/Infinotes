/** @format */

import * as React from 'react'

type OriginType = 'mouse' | 'touch1' | 'touch2'
type EventType = 'tap' | 'double' | 'hold' | 'start' | 'move' | 'end'

interface MouseTouchEvent {
    type: EventType
    origin: OriginType
    startPos: IPos
    endPos?: IPos
    isHeld: boolean
    moveChange?: IPos
    durationms?: number
}

type HandlerArgs = {
    event: MouseTouchEvent
    skip: (times: number) => void
}

export type HandlerFunc = (args: HandlerArgs) => void

// This keeps track of which components got triggered during a mouse/touch event
// It only keeps track of two touches on mobile devices
let eventStacks: { [key: string]: number[] } = {
    mouse: [],
    touch1: [],
    touch2: [],
}

// Keeps track of which touch refers to which touch event stack
let touchIds: { [key: string]: 'touch1' | 'touch2' } = {}

const getTouchStackAndOrigin = (
    e: React.TouchEvent,
): { stack: number[]; origin: 'touch1' | 'touch2' } => {
    const touchId = e.changedTouches[0] && e.changedTouches[0].identifier
    if (e.type === 'touchend' || e.type === 'touch cancel') {
        let origin = touchIds[touchId]
        delete touchIds[touchId]
        return { stack: eventStacks[origin], origin } // HERE: origin is undefined?
    }

    if (!touchId) {
        return { stack: [], origin: undefined }
    }

    if (!touchIds[touchId]) {
        if (Object.keys(touchIds).length === 0) {
            touchIds[touchId] = 'touch1'
        } else if (Object.keys(touchIds).length === 1) {
            touchIds[touchId] = 'touch2'
        }
    }
    return { stack: eventStacks[touchIds[touchId]], origin: touchIds[touchId] }
}

// Handler ids
let nextId = 0
let bubbleSkips: { [key: string]: number } = {}
const skip = (times: number = NaN, origin: OriginType, event: EventType) => {
    bubbleSkips[origin + event] = times
}

const callHandler = (handler: HandlerFunc, event: MouseTouchEvent, handlerId: number): void => {
    if (true) {
        handler({
            event,
            skip: (times) => skip(times, event.origin, event.type),
        })
    }
    if (event.type === 'end') {
        eventStacks[event.origin].pop()
    }
}

const useTouch = (handler: HandlerFunc) => {
    const [id] = React.useState(nextId++)
    const [isPressed, setIsPressed] = React.useState(false)
    const [startTime, setStartTime] = React.useState(NaN)
    const [prevTime, setPrevTime] = React.useState(NaN)

    const [isHeld, setIsHeld] = React.useState(false)
    const [startPos, setStartPos] = React.useState<IPos>(null)
    const [prevPos, setPrevPos] = React.useState<IPos>(null)

    //start, end, move, cancel
    const onTouchStartCapture = (e: React.TouchEvent) => {
        getTouchStackAndOrigin(e).stack.push(id)
    }

    const onTouchStart = (e: React.TouchEvent) => {
        const { origin } = getTouchStackAndOrigin(e)

        const touch = e.changedTouches[0]
        setStartPos((prev) => {
            callHandler(handler, { isHeld, startPos, origin, type: 'start' }, id)
            return { x: touch.clientX, y: touch.clientY }
        })
        setPrevPos({ x: touch.clientX, y: touch.clientY })
        setIsHeld(true)

        if (!startTime) {
            setStartTime(Date.now())
        } // HERE: what happens with two fingers?
        if (origin === 'touch2') {
            setIsHeld(false)
        }
    }

    const onTouchMove = (e: React.TouchEvent) => {
        const { stack, origin } = getTouchStackAndOrigin(e)
        if (stack.length) {
            const touch = e.changedTouches[0]
            const moveChange: IPos = {
                x: touch.clientX - prevPos.x || 0,
                y: touch.clientY - prevPos.y || 0,
            }
            callHandler(handler, { isHeld, moveChange, startPos, origin, type: 'move' }, id)
            if (moveChange.x ** 2 + moveChange.y ** 2 > 25) {
                setIsHeld(false)
            } else if (Date.now() - startTime > 1500 && isHeld) {
                callHandler(handler, { isHeld, startPos, origin, type: 'hold' }, id)
            }
        }
    }

    const onTouchEnd = (e: React.TouchEvent) => {
        const { origin } = getTouchStackAndOrigin(e)
        if (startTime - prevTime < 800) {
            callHandler(handler, { isHeld, startPos, origin, type: 'double' }, id)
        } else if (Date.now() - startTime < 600) {
            callHandler(handler, { isHeld, startPos, origin, type: 'tap' }, id)
        }
        callHandler(handler, { isHeld, startPos, origin, type: 'end' }, id)
        setIsHeld(false)
        setStartTime(NaN)
        setPrevTime(Date.now())
        setStartPos(null)
        setPrevPos(null)
    }

    const onMouseDownCapture = (e: React.MouseEvent) => {
        eventStacks.mouse.push(id)
    }

    const onMouseDown = (e: React.MouseEvent) => {
        if (bubbleSkips.mousestart-- > 0) {
            return
        }
        setIsPressed(true)
        setStartTime(Date.now())
        const newStartPos: IPos = {
            x: e.clientX,
            y: e.clientY,
        }
        setStartPos(newStartPos)
        setIsHeld(true)
        callHandler(
            handler,
            { isHeld: true, startPos: newStartPos, origin: 'mouse', type: 'start' },
            id,
        )
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (bubbleSkips.mousemove-- > 0) {
            return
        }
        if (isPressed) {
            const moveChange: IPos = {
                x: e.movementX,
                y: e.movementY,
            }
            callHandler(
                handler,
                { isHeld, moveChange, startPos, origin: 'mouse', type: 'move' },
                id,
            )
        }
    }

    const onMouseUp = (e: React.MouseEvent) => {
        if (bubbleSkips.mouseend-- > 0) {
            return
        }
        if (startTime - prevTime < 800) {
            callHandler(handler, { isHeld, startPos, origin: 'mouse', type: 'double' }, id)
        } else if (Date.now() - startTime < 600) {
            callHandler(handler, { isHeld, startPos, origin: 'mouse', type: 'tap' }, id)
        }
        callHandler(handler, { isHeld, startPos, origin: 'mouse', type: 'end' }, id)
        setIsPressed(false)
        setIsHeld(false)
        setStartTime(NaN)
        setPrevTime(Date.now())
        setStartPos(null)
        setPrevPos(null)
    }

    return {
        events: {
            onTouchStartCapture,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onMouseDownCapture,
            onMouseDown,
            onMouseMove,
            onMouseUp,
        },
        handlerId: id,
    }
}

export default useTouch
