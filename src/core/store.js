import { applyMiddleware, createStore, compose } from "redux"

import thunk from "redux-thunk"
import promiseMiddleware from "redux-promise-middleware"

import reducer from "./reducers"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [promiseMiddleware(), thunk];

export default createStore(reducer, composeEnhancers(
    applyMiddleware(...middleware)
))
