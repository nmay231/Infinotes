/** @format */

import * as React from 'react'

interface IFormButtonProps {
    className?: string
    children: string | number
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'info'
    click: (e?: React.MouseEvent) => void
}

const FormButton: React.FC<IFormButtonProps> = ({
    className = '',
    children,
    type = 'primary',
    click,
}) => {
    const handleClick: React.MouseEventHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        click()
    }

    return (
        <button role="button" onClick={handleClick} className={`btn btn-${type} ${className}`}>
            {children}
        </button>
    )
}

export default FormButton
