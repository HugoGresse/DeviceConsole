import React, { Component } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Layout } from 'antd';

import './App.css';

const { Header, Content, Footer } = Layout;

class App extends Component {

    render() {
        return (
            <Layout>
                <Header style={{textAlign: 'center'}}>
                    <i className="material-icons" style={{color:'white', fontSize:'40px', marginTop:'10px'}}>touch_app</i>
                    <span style={{color:'white'}}>DeviceConsole</span>
                </Header>
                <Layout>
                    <Content className="content">
                        <CookiesProvider style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                            {this.props.children}
                        </CookiesProvider>
                    </Content>
                </Layout>
                <Footer style={{ textAlign: 'center' }}><a href="https://hugo.gresse.io" style={{ color: '#222' }}>Hugo Copyright ©2017</a></Footer>
            </Layout>
        );
    }
}

export default App;
