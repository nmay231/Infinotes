/** @format */

import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import LoginPage from './views/LoginPage'
import MainPage from './views/MainPage'

import GlobalContext from './components/context/GlobalContext'

const App: React.FC = () => {
    return (
        <Router>
            <GlobalContext>
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
            </GlobalContext>
        </Router>
    )
}

export default App
