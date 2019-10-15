/** @format */

import * as React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import App from './App'
import './scss/app'
import reducers from './redux/reducers'

const store = createStore(reducers, applyMiddleware(thunk))

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
