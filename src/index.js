import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { Router, Route, IndexRedirect, browserHistory } from "react-router";
import ReactGA from 'react-ga';

import { initAuth } from "./core/auth"
import store from "./core/store"
import App from './component/App';
import Devices from './component/devices/Devices';
import Login from './component/Login'
import { requireAuth, requireUnauth } from "./auth"

import './index.css';

function render() {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory} onUpdate={logPageView}>

                <Route path="/login" component={Login} onEnter={requireUnauth(store.getState)} />

                <Route path="/" component={App} onEnter={requireAuth(store.getState)} >
                    <IndexRedirect to="devices" />
                    <Route path="devices" name="Devices" component={Devices} />
                </Route>

            </Router>
        </Provider>,
        document.getElementById('root')
    )
}

// registerServiceWorker();


function logPageView() {
    if (process.env.NODE_ENV === 'development') {
        return;
    }
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
}

ReactGA.initialize('UA-106330269-1');

initAuth(store.dispatch)
    .then(() => render())
    .catch(error => console.error(error));
