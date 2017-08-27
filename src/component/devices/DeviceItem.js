import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
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
            <Row style={{marginTop:'10px'}}>
                <Col span={8}>
                    {this.props.device.key}
                </Col>
                <Col span={6}>
                    {name}
                </Col>
                <Col span={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative />
                </Col>
                <Col span={4}>

                    <Button type="primary" icon="right-square" style={{marginTop:'-10px'}}>Send</Button>
                </Col>
            </Row>
    );
    }
}

export default DeviceItem;