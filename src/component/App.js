import React, { Component } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Layout} from 'antd';

import logo from './logo.svg';
import './App.css';

const { Header, Content, Footer } = Layout;

class App extends Component {

    render() {
        return (
            <Layout>
                <Header>
                    <img src={logo} className="App-logo" alt="logo" /></Header>
                <Layout>
                    <Content style={{ padding: '0 50px' }}>
                        <CookiesProvider style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                            {this.props.children}
                        </CookiesProvider>
                    </Content>
                </Layout>
                <Footer>Hugo Copyright ©2017</Footer>
            </Layout>
        );
    }
}

export default App;
