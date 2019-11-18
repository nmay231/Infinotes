/** @format */

import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'

import LoginPage from './views/LoginPage'
import MainPage from './views/MainPage'
import useLogin from './utils/useLogin'
import { client } from './utils/graphql'

const App: React.FC = () => {
    const { loginFromCache } = useLogin()

    React.useEffect(() => {
        loginFromCache()
    }, [])

    return (
        <Router>
            <ApolloProvider client={client}>
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
            </ApolloProvider>
        </Router>
    )
}

export default App
