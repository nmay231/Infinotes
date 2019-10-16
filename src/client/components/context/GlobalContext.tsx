/** @format */

import * as React from 'react'
import { LoginProvider } from './LoginContext'
import { NotesProvider } from './NotesContext'
import { NoteDraftProvider } from './NoteDraftContext'
import LoginListener from './LoginListener'
import { PressProvider } from './PressContext'

const GlobalContext: React.FC = ({ children }) => {
    return <PressProvider>{children}</PressProvider>
}

export default GlobalContext
