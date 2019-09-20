/** @format */

import * as React from 'react'
import useLogin from '../../utils/useLogin'

const LoginListener: React.FC = () => {
    const { loginFromCache } = useLogin()

    React.useEffect(() => {
        loginFromCache()
    }, [])

    return <></>
}

export default LoginListener
