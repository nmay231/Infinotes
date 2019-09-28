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

type HandlerArgs = {
    event: MouseTouchEvent
    // skip: (times: number) => void
}

export type HandlerFunc = (args: HandlerArgs) => number | void

// This keeps track of which components got triggered during a mouse/touch event
// It only keeps track of two touches on mobile devices
let eventStacks: { [key: string]: HandlerFunc[] } = {
    mouse: [],
    touch1: [],
    touch2: [],
}

// Keeps track of which touch refers to which touch event stack
// let touchIds: { [key: string]: 'touch1' | 'touch2' } = {}

// const getTouchStackAndOrigin = (
//     e: React.TouchEvent,
// ): { stack: number[]; origin: 'touch1' | 'touch2' } => {
//     const touchId = e.changedTouches[0] && e.changedTouches[0].identifier
//     if (e.type === 'touchend' || e.type === 'touch cancel') {
//         let origin = touchIds[touchId]
//         delete touchIds[touchId]
//         return { stack: eventStacks[origin], origin } // HERE: origin is undefined?
//     }

//     if (!touchId) {
//         return { stack: [], origin: undefined }
//     }

//     if (!touchIds[touchId]) {
//         if (Object.keys(touchIds).length === 0) {
//             touchIds[touchId] = 'touch1'
//         } else if (Object.keys(touchIds).length === 1) {
//             touchIds[touchId] = 'touch2'
//         }
//     }
//     return { stack: eventStacks[touchIds[touchId]], origin: touchIds[touchId] }
// }

// Handler ids
let nextId = 0
let bubbleSkips: { [key: string]: number } = {}
const skip = (times: number = NaN, origin: OriginType, event: EventType) => {
    bubbleSkips[origin + event] = times
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

    // if (event.type === 'end') {
    //     console.group('pop')
    //     console.log('before', eventStacks[event.origin])
    //     console.log('popped', eventStacks[event.origin].pop())
    //     console.log('after', eventStacks[event.origin])
    //     console.groupEnd()
    // }
    // if (event.type === 'tap') console.log('taps', handlerId, bubbleSkips[event.origin + event.type])
    // if (bubbleSkips[event.origin + event.type]-- > 0) {
    //     console.error(handlerId, ' skipped!')
    //     return
    // } else {
    //     handler({
    //         event,
    //         skip: (times) => skip(times, event.origin, event.type),
    //     })
    // }
}

const useTouch = (handler: HandlerFunc) => {
    const [id] = React.useState(React.useMemo(() => nextId++, []))
    const {
        startTime: [startTime, setStartTime],
        prevTime: [prevTime, setPrevTime],
        isStationary: [isStationary, setIsStationary],
        startPos: [startPos, setStartPos],
    } = React.useContext(PressContext)

    const [prevPos, setPrevPos] = React.useState<IPos>(null)
    const [canBeDouble, setCanBeDouble] = React.useState(false)

    //start, end, move, cancel
    // const onTouchStartCapture = (e: React.TouchEvent) => {
    //     getTouchStackAndOrigin(e).stack.push(id)
    // }

    // const onTouchStart = (e: React.TouchEvent) => {
    //     const { origin } = getTouchStackAndOrigin(e)

    //     const touch = e.changedTouches[0]
    //     setStartPos((prev) => {
    //         callHandler(handler, { isStationary, startPos, origin, type: 'start' }, id)
    //         return { x: touch.clientX, y: touch.clientY }
    //     })
    //     setPrevPos({ x: touch.clientX, y: touch.clientY })
    //     setIsStationary(true)

    //     if (!startTime) {
    //         setStartTime(Date.now())
    //     } // HERE: what happens with two fingers?
    //     if (origin === 'touch2') {
    //         setIsStationary(false)
    //     }
    // }

    // const onTouchMove = (e: React.TouchEvent) => {
    //     const { stack, origin } = getTouchStackAndOrigin(e)
    //     if (stack.length) {
    //         const touch = e.changedTouches[0]
    //         const moveChange: IPos = {
    //             x: touch.clientX - prevPos.x || 0,
    //             y: touch.clientY - prevPos.y || 0,
    //         }
    //         callHandler(handler, { isStationary, moveChange, startPos, origin, type: 'move' }, id)
    //         if (moveChange.x ** 2 + moveChange.y ** 2 > 25) {
    //             setIsStationary(false)
    //         } else if (Date.now() - startTime > 800 && isStationary) {
    //             callHandler(handler, { isStationary, startPos, origin, type: 'hold' }, id)
    //         }
    //     }
    // }

    // const onTouchEnd = (e: React.TouchEvent) => {
    // Prevent Mouse events from running
    // if (e.type === 'touchend') e.preventDefault()
    //     const { origin } = getTouchStackAndOrigin(e)
    //     if (startTime - prevTime < 800) {
    //         callHandler(handler, { isStationary, startPos, origin, type: 'double' }, id)
    //     } else if (Date.now() - startTime < 600) {
    //         callHandler(handler, { isStationary, startPos, origin, type: 'tap' }, id)
    //     }
    //     callHandler(handler, { isStationary, startPos, origin, type: 'end' }, id)
    //     setIsStationary(false)
    //     setStartTime(NaN)
    //     setPrevTime(Date.now())
    //     setStartPos(null)
    //     setPrevPos(null)
    // }

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
            } else if (Date.now() - startTime > 800 && isStationary) {
                callHandlers({ isStationary, startPos, origin: 'mouse', type: 'hold' })
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
    }

    return {
        events: {
            // onTouchStartCapture,
            // onTouchStart,
            // onTouchMove,
            // onTouchEnd,
            onMouseDownCapture,
            onMouseDown,
            onMouseMove,
            onMouseUp,
        },
        handlerId: id,
    }
}

export default useTouch
