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
                    setDeviceName={this.props.setDeviceName}
                    deleteDevice={this.props.deleteDevice}
                />
            );
        });

        return (
            <div>
                <Row className="data-row-title">
                    <Col span={10}>
                        <h3>Name</h3>
                    </Col>
                    <Col xs={0} sm={4}>
                        <h3>Updated</h3>
                    </Col>
                    <Col xs={0} sm={10}>
                        <h3>Action</h3>
                    </Col>
                </Row>
                {deviceItems}
            </div>
        );
    }

}
export default DeviceList
