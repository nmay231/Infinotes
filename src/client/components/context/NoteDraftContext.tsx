/** @format */

import * as React from 'react'

export const NoteDraftContext = React.createContext<
    [
        { initialContent: string; offset: IPos },
        React.Dispatch<React.SetStateAction<{ initialContent: string; offset: IPos }>>,
    ]
>([
    { initialContent: '', offset: { x: 0, y: 0 } },
    () => console.log('This developer failed in life'),
])

export const NoteDraftProvider: React.FC = ({ children }) => {
    const [NoteDraft, setNoteDraft] = React.useState<{
        initialContent: string
        offset: IPos
    } | null>(null)

    return (
        <NoteDraftContext.Provider value={[NoteDraft, setNoteDraft]}>
            {children}
        </NoteDraftContext.Provider>
    )
}
