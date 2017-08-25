import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Time from 'react-time'


class DeviceItem extends Component {

    constructor() {
        super();
        this.sentNotification = this.sentNotification.bind(this);
    }

    sentNotification(value) {
        // TODO
    }


    render() {
        const name = this.props.device.name + ((this.props.device.itIsMe) ? '(me)' : '');
        return (
            <Row>
                <Col span={8}>
                    {this.props.device.key}
                </Col>
                <Col span={6}>
                    {name}
                </Col>
                <Col span={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative />
                </Col>
            </Row>
    );
    }
}

export default DeviceItem;