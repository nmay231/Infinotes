/** @format */

import * as React from 'react'
import { PressContext } from '../components/context/PressContext'

type OriginType = 'mouse' | 'touch1' | 'touch2'
type EventType = 'tap' | 'double' | 'hold' | 'start' | 'move' | 'end'

interface MouseTouchEvent {
    type: EventType
    origin: OriginType
    startPos: IPos
    endPos?: IPos
    isStationary: boolean
    moveChange?: IPos
    durationms?: number
}

export type HandlerFunc = ({ event }: { event: MouseTouchEvent }) => number | void

// This keeps track of which components got triggered during a mouse/touch event
// It only keeps track of two touches on mobile devices
let eventStacks: { [key: string]: HandlerFunc[] } = {
    mouse: [],
    touch1: [],
    touch2: [],
}

// Keeps track of which touch refers to which touch event stack
let touchIds: { [key: string]: 'touch1' | 'touch2' } = {}

const getTouchOrigin = (e: React.TouchEvent): 'touch1' | 'touch2' => {
    const touchId = e.changedTouches[0] && e.changedTouches[0].identifier
    if (e.type === 'touchend' || e.type === 'touch cancel') {
        let origin = touchIds[touchId]
        delete touchIds[touchId]
        return origin // HERE: origin is undefined?
    }

    if (typeof touchId !== 'number') {
        return undefined
    }

    if (!touchIds[touchId]) {
        if (Object.keys(touchIds).length === 0) {
            touchIds[touchId] = 'touch1'
        } else if (Object.keys(touchIds).length === 1) {
            touchIds[touchId] = 'touch2'
        }
    }
    return touchIds[touchId]
}

const callHandlers = (event: MouseTouchEvent): void => {
    let skips: number = 0
    for (let handler of eventStacks[event.origin].reduce((prev, cur) => [cur, ...prev], [])) {
        if (skips-- <= 0) {
            skips = handler({ event }) || 0
        }
    }
    if (event.type === 'end') {
        eventStacks[event.origin] = []
    }
}

const useTouch = (handler: HandlerFunc) => {
    const {
        startTime: [startTime, setStartTime],
        prevTime: [prevTime, setPrevTime],
        isStationary: [isStationary, setIsStationary],
        startPos: [startPos, setStartPos],
    } = React.useContext(PressContext)

    const [prevPos, setPrevPos] = React.useState<IPos>(null)
    const [canBeDouble, setCanBeDouble] = React.useState(false)
    const [holding, setHolding] = React.useState<OriginType | 'cancel'>(null)

    if (holding && holding !== 'cancel' && isStationary) {
        callHandlers({ isStationary, startPos, origin: holding, type: 'hold' })
        setHolding(null)
    }

    //start, end, move, cancel
    // HERE: add onTouchCancel
    const onTouchStartCapture = (e: React.TouchEvent) => {
        eventStacks[getTouchOrigin(e)].push(handler)
    }

    const onTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation()
        const origin = getTouchOrigin(e)

        const startPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        callHandlers({ isStationary: true, startPos, origin, type: 'start' })
        setStartPos(startPos)
        setPrevPos(startPos)
        setIsStationary(true)

        setStartTime(Date.now())

        // if (!startTime) {
        //     setStartTime(Date.now())
        // } // HERE: what happens with two fingers?
        // if (origin === 'touch2') {
        //     setIsStationary(false)
        // }
        setTimeout(() => setHolding((holding) => (holding === 'cancel' ? null : origin)), 700)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation()
        const origin = getTouchOrigin(e)
        const touch = e.changedTouches[0]
        const moveChange: IPos = {
            x: touch.clientX - prevPos.x || 0,
            y: touch.clientY - prevPos.y || 0,
        }
        callHandlers({ isStationary, moveChange, startPos, origin, type: 'move' })
        if (moveChange.x ** 2 + moveChange.y ** 2 > 25) {
            setIsStationary(false)
        }
        setPrevPos({ x: touch.clientX, y: touch.clientY })
    }

    const onTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation()

        // Prevent simulated click events from running
        e.preventDefault()

        const origin = getTouchOrigin(e)
        if (startTime - prevTime < 300 && canBeDouble) {
            callHandlers({ isStationary, startPos, origin, type: 'double' })
            setCanBeDouble(false)
        } else if (Date.now() - startTime < 300) {
            callHandlers({ isStationary, startPos, origin, type: 'tap' })
            setCanBeDouble(true)
        }
        callHandlers({ isStationary, startPos, origin, type: 'end' })
        setIsStationary(false)
        setStartTime(NaN)
        setPrevTime(Date.now())
        setStartPos(null)
        setPrevPos(null)
        if (Date.now() - startTime < 700) {
            setHolding('cancel')
        }
    }

    const onMouseDownCapture = (e: React.MouseEvent) => {
        eventStacks.mouse.push(handler)
    }

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setStartTime(Date.now())
        const newStartPos: IPos = {
            x: e.clientX,
            y: e.clientY,
        }
        setStartPos(newStartPos)
        setIsStationary(true)
        callHandlers({ isStationary: true, startPos: newStartPos, origin: 'mouse', type: 'start' })
        setTimeout(() => setHolding((holding) => (holding === 'cancel' ? null : 'mouse')), 700)
    }

    const onMouseMove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (e.buttons === 1) {
            const moveChange: IPos = {
                x: e.movementX,
                y: e.movementY,
            }
            callHandlers({ isStationary, moveChange, startPos, origin: 'mouse', type: 'move' })
            if ((startPos.x - e.clientX) ** 2 + (startPos.y - e.clientY) ** 2 > 16) {
                setIsStationary(false)
            }
        }
    }

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (startTime - prevTime < 300 && canBeDouble) {
            callHandlers({ isStationary, startPos, origin: 'mouse', type: 'double' })
            setCanBeDouble(false)
        } else if (Date.now() - startTime < 300) {
            callHandlers({ isStationary, startPos, origin: 'mouse', type: 'tap' })
            setCanBeDouble(true)
        }
        callHandlers({ isStationary, startPos, origin: 'mouse', type: 'end' })
        setIsStationary(false)
        setStartTime(NaN)
        setPrevTime(Date.now())
        setStartPos(null)
        setPrevPos(null)
        if (Date.now() - startTime < 700) {
            setHolding('cancel')
        }
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
    }
}

export default useTouch
