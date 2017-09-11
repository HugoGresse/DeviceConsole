import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { CookiesProvider } from 'react-cookie';
import { Layout, Menu, Dropdown } from 'antd';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getAuth, authActions } from '../core/auth';

import Footer from './Footer'
import './App.css';

const { Header, Content } = Layout;

class App extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
      }


    constructor() {
        super();

        this.logout = this.logout.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        const { router } = this.context;
        const { auth } = this.props;

        if (auth.authenticated && !nextProps.auth.authenticated) {
            router.replace('/login');
        } else if (!auth.authenticated && nextProps.auth.authenticated) {
            router.replace('/');
        }
    }

    logout() {
        this.props.signOut()
    }

    render() {
        const menu =
            <Menu>
                <Menu.Item key="0">
                    <span>{this.props.auth.email ? this.props.auth.email : ''}</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <a onClick={this.logout} >
                        Logout
                    </a>
                </Menu.Item>
            </Menu>

        return (
            <Layout>
                <Header style={{ textAlign: 'left' }}>
                    <i className="material-icons" style={{ color: 'white', fontSize: '40px', marginTop: '10px' }}>touch_app</i>
                    <span style={{ color: 'white' }}>DeviceConsole</span>

                    <Dropdown overlay={menu} trigger={['click']}>
                        <img className="headerAvatar" src={this.props.auth.avatar ? this.props.auth.avatar : ''} alt="presentation" />
                    </Dropdown>

                </Header>
                <Layout>
                    <Content className="content">
                        <CookiesProvider style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                            {this.props.children}
                        </CookiesProvider>
                    </Content>
                </Layout>
                <Footer />
            </Layout>
        );
    }
}


const mapStateToProps = createSelector(
    getAuth,
    (auth) => ({
        auth,
    })
);


const mapDispatchToProps = Object.assign(
    {},
    authActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
