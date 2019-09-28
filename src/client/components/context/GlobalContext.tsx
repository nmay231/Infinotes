/** @format */

import * as React from 'react'
import { LoginProvider } from './LoginContext'
import { NotesProvider } from './NotesContext'
import { NoteDraftProvider } from './NoteDraftContext'
import LoginListener from './LoginListener'
import { PressProvider } from './PressContext'

const GlobalContext: React.FC = ({ children }) => {
    // Ah... look at that lovely pyramid of death
    // Just wait until I get to learning Redux
    return (
        <LoginProvider>
            <PressProvider>
                <NotesProvider>
                    <NoteDraftProvider>{children}</NoteDraftProvider>
                </NotesProvider>
            </PressProvider>
            <LoginListener />
        </LoginProvider>
    )
}

export default GlobalContext
