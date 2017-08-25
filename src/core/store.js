import { applyMiddleware, createStore, compose } from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
import promiseMiddleware from "redux-promise-middleware"

import reducer from "./reducers"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [promiseMiddleware(), thunk];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

export default createStore(reducer, composeEnhancers(
    applyMiddleware(...middleware)
))
