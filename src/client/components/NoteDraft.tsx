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

    const CancelBubbling: React.MouseEventHandler = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    React.useEffect(() => {
        document.getElementById('noteDraftInput').focus()
    }, [onSubmit])

    return (
        <div
            id="noteDraft"
            className="card p-2 d-flex flex-row"
            style={{ width: '20rem' }}
            onMouseDown={CancelBubbling}
            onMouseUp={CancelBubbling}
        >
            <form onSubmit={handleSubmit}>
                <input
                    id="noteDraftInput"
                    type="text"
                    className="form-control ml-auto mb-n3"
                    value={content}
                    onChange={handleChange}
                />
            </form>
            <button
                role="submit"
                className="btn btn-success ml-2"
                onClick={() => onSubmit(content)}
            >
                ✓
            </button>
            <button role="button" className="btn btn-danger ml-2" onClick={onDefocus}>
                &times;
            </button>
        </div>
    )
}

export default NoteDraft
