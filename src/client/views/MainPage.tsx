/** @format */

import * as React from 'react'

import Canvas from '../components/Canvas'
import { useNotes } from '../utils/useNotes'

const MainPage: React.FC = () => {
    const { fetchNotes } = useNotes()

    React.useEffect(() => {
        ;(async () => {
            fetchNotes()
        })()
    }, [])

    return (
        <section className="row d-flex justify-content-center min-vw-100 min-vh-100">
            <Canvas />
        </section>
    )
}

export default MainPage
