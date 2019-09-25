/** @format */

import * as React from 'react'
import { LoginProvider } from './LoginContext'
import { NotesProvider } from './NotesContext'
import { NoteDraftProvider } from './NoteDraftContext'
import LoginListener from './LoginListener'

const GlobalContext: React.FC = ({ children }) => {
    return (
        <LoginProvider>
            <NotesProvider>
                <NoteDraftProvider>{children}</NoteDraftProvider>
            </NotesProvider>
            <LoginListener />
        </LoginProvider>
    )
}

export default GlobalContext
