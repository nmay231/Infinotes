/** @format */

import * as React from 'react'

export const PressContext = React.createContext<{
    startTime: [number, React.Dispatch<React.SetStateAction<number>>]
    prevTime: [number, React.Dispatch<React.SetStateAction<number>>]
    isStationary: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    startPos: [IPos, React.Dispatch<React.SetStateAction<IPos>>]
}>(null)

export const PressProvider: React.FC = ({ children }) => {
    const [startTime, setStartTime] = React.useState(NaN)
    const [prevTime, setPrevTime] = React.useState(NaN)
    const [isStationary, setIsStationary] = React.useState(false)
    const [startPos, setStartPos] = React.useState<IPos>(null)

    return (
        <PressContext.Provider
            value={{
                startTime: [startTime, setStartTime],
                prevTime: [prevTime, setPrevTime],
                isStationary: [isStationary, setIsStationary],
                startPos: [startPos, setStartPos],
            }}
        >
            {children}
        </PressContext.Provider>
    )
}
