/** @format */

import * as React from 'react'

interface INoteDraftProps {
    onSubmit: (content: string) => void
    onDefocus?: () => void
    initialContent?: string
}

const NoteDraft: React.FC<INoteDraftProps> = ({ onSubmit, onDefocus, initialContent = '' }) => {
    const [content, setContent] = React.useState(initialContent)

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(content)
    }

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    const handleFocus: React.FocusEventHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.type === 'blur' && e.target.value === '') {
            onDefocus()
        } else {
            onSubmit(content)
        }
    }

    React.useEffect(() => {
        document.getElementById('noteDraftInput').focus()
    }, [onSubmit])

    return (
        <div id="noteDraft" className="card p-2 d-flex flex-row" style={{ width: '15rem' }}>
            <form onSubmit={handleSubmit}>
                <input
                    id="noteDraftInput"
                    type="text"
                    className="form-control mb-n3"
                    value={content}
                    onChange={handleChange}
                    onBlur={handleFocus}
                />
            </form>
            <button className="btn">&times;</button>
        </div>
    )
}

export default NoteDraft
