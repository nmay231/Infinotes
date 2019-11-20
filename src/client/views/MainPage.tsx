/** @format */

import * as React from 'react'
import { useDispatch } from 'react-redux'

import useLogin from '../utils/useLogin'
import { NOTES_API, USERS_API, join } from '../utils/apis'
import { initNotes, failedNoteRequest } from '../redux/actions/noteActions'

import { PressProvider } from '../components/context/PressContext'
import Canvas from '../components/Canvas'

const MainPage: React.FC = () => {
    const { json } = useLogin()
    const dispatch = useDispatch()

    React.useEffect(() => {
        ;(async () => {
            try {
                let rawNotes = await json<INote[]>(NOTES_API)
                rawNotes = await Promise.all<INote>(
                    rawNotes.map((note) =>
                        json<{ username: string }>(
                            join(USERS_API, `${note.user_id}`, 'username'),
                        ).then(({ username }) => Promise.resolve({ ...note, username })),
                    ),
                )
                dispatch(initNotes(rawNotes))
            } catch (err) {
                dispatch(failedNoteRequest('MainPage render', err.message, 'Failed to load notes'))
            }
        })()
    }, [])

    return (
        <PressProvider>
            <section className="row d-flex justify-content-center min-vw-100 min-vh-100">
                <Canvas />
            </section>
        </PressProvider>
    )
}

export default MainPage
