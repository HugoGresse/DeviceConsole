import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { Router, Route, IndexRedirect, browserHistory } from "react-router";

import { initAuth } from "./core/auth"
import store from "./core/store"
import App from './component/App';
import Devices from './component/devices/Devices';
import Login from './component/Login'
import { requireAuth, requireUnauth } from "./auth"
// import registerServiceWorker from './registerServiceWorker';

import './index.css';


function render() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>

                <Route path="/login" component={Login} onEnter={requireUnauth(store.getState)} />

                <Route path="/" component={App} onEnter={requireAuth(store.getState)} >
                    <IndexRedirect to="devices" />
                    <Route path="devices" name="Devices" component={Devices}/>
                </Route>

            </Router>
        </Provider>,
        document.getElementById('root')
    )
}

// registerServiceWorker();

initAuth(store.dispatch)
    .then(() => render())
    .catch(error => console.error(error));
