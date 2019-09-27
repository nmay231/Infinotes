/** @format */

import * as React from 'react'

interface Mouser {
    event: 'tap' | 'hold' | 'start' | 'move' | 'end'
    moveChange?: IPos
    startPos: IPos
    endPos?: IPos
    duration: number
}

let eventStack: { [key: string]: any[] } = {
    mouse: [],
}

let handlerStack: [any, any, any][] = []
const identity = () => {}

const useTouch = (mouseHandler: any, touchHandler: any, universalHandler?: any) => {
    const [state, setState] = React.useState(1)

    const [bubbleSkips, setBubbleSkips] = React.useState(0) // completely useless you dork
    const popEvent = (stack: Array<any>, times: number = 0) => {
        let value: any
        while (times-- >= 0 && stack.length > 0) {
            value = stack.pop()
        }
        setBubbleSkips(0)
        return value
    }

    const onClickCapture = (e: React.MouseEvent) => {
        handlerStack.push([mouseHandler, touchHandler, universalHandler])
    }

    const onClick = (e: React.MouseEvent) => {
        let [handler] = skipBubbling(1)
        return handler('pass down Mouserrrrerer event')
    }

    const skipBubbling = (times: number = NaN) => {
        let value: any
        while (times-- > 0 && handlerStack.length > 0) {
            value = handlerStack.pop()
        }
        return value
    }

    return { events: { onClick, onClickCapture }, skipBubbling }
}

export default useTouch
