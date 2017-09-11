import React, { Component } from 'react'
import { Layout, Icon } from 'antd'

export default class Footer extends Component {


    render() {
        return <Layout.Footer
            style={{ textAlign: 'center' }}>

            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://hugo.gresse.io"
                style={{ color: '#222' }}>
                <Icon
                    type="github"
                    style={{ fontSize: 20 }} />
            </a>

        </Layout.Footer>
    }

}
