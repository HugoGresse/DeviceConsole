import React, { Component } from 'react'
import { Layout, Row, Col, Button } from 'antd'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { authActions, getAuth } from '../core/auth';

const { Content, Footer } = Layout

export class Login extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            login: false,
            error: null
        };
        this.onLoginClick = this.onLoginClick.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        const { router } = this.context;
        const { auth } = this.props;

        if (auth.authenticated && !nextProps.auth.authenticated) {
            router.replace('/');
        } else if (!auth.authenticated && nextProps.auth.authenticated) {
            this.onLogin(nextProps.auth);
        } else if (nextProps.auth.error) {
            this.setState({
                login: false,
                error: nextProps.auth.error
            });
        } else {
            this.setState({
                login: false,
                error: "Unknown error..."
            });
        }
    }

    onLogin(auth) {
        const { router } = this.context;
        router.replace('/');
    }

    onLoginClick() {
        this.setState({ login: true });
        this.props.signInWithGoogle();
    }

    render() {
        return (
            <Layout>
                <Layout>
                    <Content style={{ textAlign: 'center' }}>

                        <Row type="flex" justify="center" align="middle" style={{ background: '#fff', padding: 24 }}>
                            <Col span={24}>
                                <h1>
                                    <i className="material-icons" style={{ fontSize: '40px', marginTop: '10px' }}>touch_app</i>
                                    <span >DeviceConsole</span>
                                </h1>
                                <br />
                                <br />
                                <Button type="primary" onClick={this.onLoginClick}>Login</Button>
                            </Col>
                            <Col span={24}>
                                <div className="error">
                                    {this.state.error ? this.state.error : ''}
                                </div>
                            </Col>
                        </Row>

                        <Row type="flex" justify="center" align="middle" style={{ background: '#fff', padding: 24 }}>
                            <Col span={24}>
                                <h2>DeviceConsole is a fast way to share a text/url to one devices of a fleet.</h2>
                                <br />
                                <p style={{ fontSize: '14px' }}>  It is a free & open source software that allow a single Google accounts to: </p>
                                <ul>
                                    <li>- register many devices through modern browser supporting service worker</li>
                                    <li>- send text or url to this devices</li>
                                </ul>
                            </Col>
                        </Row>

                    </Content>
                </Layout>
                <Footer>Hugo Copyright ©2017</Footer>
            </Layout>
        )
    }
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
    getAuth,
    auth => ({ auth })
);

const mapDispatchToProps = Object.assign(
    {},
    authActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
