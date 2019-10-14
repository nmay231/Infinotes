/** @format */

import * as React from 'react'

interface INoteDraft {
    initialContent: string
    offset: IPos
    noteId?: number
}

export const NoteDraftContext = React.createContext<
    [INoteDraft, React.Dispatch<React.SetStateAction<INoteDraft>>]
>([
    { initialContent: '', offset: { x: 0, y: 0 } },
    () => console.log('This developer failed in life'),
])

export const NoteDraftProvider: React.FC = ({ children }) => {
    const [NoteDraft, setNoteDraft] = React.useState<INoteDraft | null>(null)

    return (
        <NoteDraftContext.Provider value={[NoteDraft, setNoteDraft]}>
            {children}
        </NoteDraftContext.Provider>
    )
}
