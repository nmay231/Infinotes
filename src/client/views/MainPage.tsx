/** @format */

import * as React from 'react'

import { PressProvider } from '../components/context/PressContext'
import Canvas from '../components/Canvas'

const MainPage: React.FC = () => {
    return (
        <PressProvider>
            <section className="row d-flex justify-content-center min-vw-100 min-vh-100">
                <Canvas />
            </section>
        </PressProvider>
    )
}

export default MainPage
