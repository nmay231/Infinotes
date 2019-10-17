/** @format */

import * as React from 'react'
import usePress, { IPressHandler } from '../../utils/usePress'

interface IControlledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    btnStyle?: 'primary' | 'secondary' | 'success' | 'danger' | 'info'
    onPress?: (...args: any) => void
}

const StyledButton: React.FC<IControlledButtonProps> = ({
    children,
    btnStyle,
    onPress,
    ...props
}) => {
    const ButtonPressHandler: IPressHandler = ({ event }) => {
        if (event.type === 'tap' && onPress) {
            onPress()
        }
        return 5
    }

    const { eventHandlers } = usePress(ButtonPressHandler)

    return (
        <button {...props} {...eventHandlers} className={props.className + ` btn btn-${btnStyle}`}>
            {children}
        </button>
    )
}

export default StyledButton
