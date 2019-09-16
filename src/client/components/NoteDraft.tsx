/** @format */

import * as React from 'react'

interface INoteDraftProps {
    onSubmit: (content: string) => void
    onDefocus?: () => void
}

const NoteDraft: React.FC<INoteDraftProps> = ({ onSubmit, onDefocus }) => {
    const [content, setContent] = React.useState('')

    const handleSubmit: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(content)
    }

    const handleChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    const handleFocus: React.FocusEventHandler = (e: React.FocusEvent) => {
        if (e.type === 'blur') {
            onDefocus()
        }
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
                    onBlur={handleFocus}
                />
            </form>
        </div>
    )
}

export default NoteDraft
