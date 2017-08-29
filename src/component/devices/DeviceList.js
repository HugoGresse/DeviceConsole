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
                />
            );
        });

        return (
            <div>
                <Row>
                    <Col span={8}>
                        <h3>Id</h3>
                    </Col>
                    <Col span={6}>
                        <h3>Name</h3>
                    </Col>
                    <Col span={4}>
                        <h3>Updated</h3>
                    </Col>
                </Row>
                {deviceItems}
            </div>
        );
    }

}
export default DeviceList