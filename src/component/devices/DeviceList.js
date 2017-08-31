import React, { Component } from 'react';
import { Row, Col } from 'antd';
import DeviceItem from './DeviceItem'

class DeviceList extends Component {


    render() {
        let deviceItems = this.props.devices.map((device, index) => {
            return (
                <DeviceItem
                    device={device}
                    key={index}
                    sendNotification={this.props.sendNotification}
                />
            );
        });

        return (
            <div>
                <Row>
                    <Col span={10}>
                        <h3>Name</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Updated</h3>
                    </Col>
                </Row>
                {deviceItems}
            </div>
        );
    }

}
export default DeviceList