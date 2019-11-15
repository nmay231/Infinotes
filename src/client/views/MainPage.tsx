/** @format */

import * as React from 'react'
import { useDispatch } from 'react-redux'

import { useQuery, grabNotes, useMutation } from '../utils/graphql'
import { initNotes, failedNoteRequest } from '../redux/actions/noteActions'

import { PressProvider } from '../components/context/PressContext'
import Canvas from '../components/Canvas'

const MainPage: React.FC = () => {
    const dispatch = useDispatch()
    const { loading, data, error } = useQuery<{ notes: INote[] }>(
        grabNotes(null, 'id', 'content', 'offset', { user: ['username'] }),
    )

    React.useEffect(() => {
        if (error) {
            dispatch(failedNoteRequest('MainPage render', error.message, 'Failed to load notes'))
        } else if (!loading) {
            dispatch(
                initNotes(
                    data.notes.map((note) => ({ ...note, username: (note as any).user.username })),
                ),
            )
        }
    }, [loading, data, error])

    return (
        <PressProvider>
            <section className="row d-flex justify-content-center min-vw-100 min-vh-100">
                <Canvas />
            </section>
        </PressProvider>
    )
}

export default MainPage
