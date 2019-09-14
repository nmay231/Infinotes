/** @format */

import * as React from 'react'

interface INoteDraftProps {
    onSubmit: (content: string) => void
}

const NoteDraft: React.FC<INoteDraftProps> = ({ onSubmit }) => {
    const [content, setContent] = React.useState('')

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(content)
    }

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }
    React.useEffect(() => {
        document.getElementById('noteDraftInput').focus()
    }, [onSubmit])

    return (
        <div id="noteDraft" className="card p-2" style={{ width: '15rem' }}>
            <form onSubmit={handleSubmit}>
                <input
                    id="noteDraftInput"
                    type="text"
                    className="form-control mb-n3"
                    value={content}
                    onChange={handleChange}
                />
            </form>
        </div>
    )
}

export default NoteDraft
