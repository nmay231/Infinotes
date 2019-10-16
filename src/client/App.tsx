/** @format */

import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import LoginPage from './views/LoginPage'
import MainPage from './views/MainPage'
import useLogin from './utils/useLogin'

const App: React.FC = () => {
    const { loginFromCache } = useLogin()

    React.useEffect(() => {
        loginFromCache()
    }, [])

    return (
        <Router>
            <main className="container-fluid">
                <Switch>
                    {/* Main Navigation */}
                    <Route exact path="/main" component={MainPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={LoginPage} />
                    {/* Redirects */}
                    <Redirect exact from="/" to="/main" />
                </Switch>
            </main>
        </Router>
    )
}

export default App
