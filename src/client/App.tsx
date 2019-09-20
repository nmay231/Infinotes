/** @format */

import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import LoginPage from './views/LoginPage'
import Canvas from './components/Canvas'
import { LoginProvider } from './components/context/LoginContext'

const App: React.FC = () => {
    return (
        <Router>
            <LoginProvider>
                <main className="container-fluid">
                    <Switch>
                        {/* Main Navigation */}
                        <Route exact path="/main" component={Canvas} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={LoginPage} />
                        {/* Redirects */}
                        <Redirect exact from="/" to="/main" />
                    </Switch>
                </main>
            </LoginProvider>
        </Router>
    )
}

export default App
