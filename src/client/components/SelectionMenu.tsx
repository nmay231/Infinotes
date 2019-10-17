/** @format */

import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useLogin from '../utils/useLogin'

interface ISelectionMenuProps extends RouteComponentProps {
    resetView: () => void
}

const SelectionMenu: React.FC<ISelectionMenuProps> = ({ resetView, history }) => {
    const { isLoggedIn, logout, wasUser } = useLogin()
    const [visible, setVisible] = React.useState(true)

    const handleFullscreen = (e: React.MouseEvent) => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    if (!visible) {
        return (
            <div
                className="position-relative mb-auto ml-auto card p-2 rounded-0"
                style={{ top: '50%' }}
            >
                <div className="btn btn-secondary" onClick={() => setVisible(true)}>
                    <FontAwesomeIcon icon="bars" fixedWidth />
                </div>
            </div>
        )
    }

    return (
        <div
            className="position-relative mb-auto ml-auto card p-2 rounded-0"
            style={{ top: '50%' }}
        >
            <div className="d-flex flex-column flex-wrap justify-content-center">
                <div
                    className="btn btn-secondary align-self-start align-self-md-end order-md-0 order-12"
                    onClick={() => setVisible(false)}
                >
                    <FontAwesomeIcon icon="angle-right" fixedWidth />
                </div>
                {document.fullscreenEnabled && (
                    <div className="btn btn-primary my-2" onClick={handleFullscreen}>
                        Toggle Fullscreen
                    </div>
                )}
                <div className="btn btn-primary my-2" onClick={resetView}>
                    Reset View
                </div>
                {isLoggedIn ? (
                    <div className="btn btn-primary my-2" onClick={logout}>
                        Logout
                    </div>
                ) : (
                    <div
                        className="btn btn-primary mr-2 my-2"
                        onClick={() => history.push(wasUser ? '/login' : '/register')}
                    >
                        {wasUser ? 'Login' : 'Register'}
                    </div>
                )}
            </div>
        </div>
    )
}

export default withRouter(SelectionMenu)
