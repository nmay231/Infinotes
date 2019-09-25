/** @format */

import * as React from 'react'

export const NotesContext = React.createContext<
    [INote[], React.Dispatch<React.SetStateAction<INote[]>>]
>([[], () => console.log('You can not see me...')])

export const NotesProvider: React.FC = ({ children }) => {
    const [notes, setNotes] = React.useState<INote[]>([])

    return <NotesContext.Provider value={[notes, setNotes]}>{children}</NotesContext.Provider>
}
